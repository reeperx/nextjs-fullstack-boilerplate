"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createLogger } from "@/lib/logger"

const logger = createLogger("performance")

type PerformanceMetrics = {
  ttfb: number | null
  fcp: number | null
  lcp: number | null
  cls: number | null
  fid: number | null
  componentRenderTimes: Record<string, number>
}

type PerformanceContextType = {
  metrics: PerformanceMetrics
  trackComponentRender: (componentName: string, renderTime: number) => void
}

const PerformanceContext = createContext<PerformanceContextType>({
  metrics: {
    ttfb: null,
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    componentRenderTimes: {},
  },
  trackComponentRender: () => {},
})

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    ttfb: null,
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    componentRenderTimes: {},
  })

  // Track component render times
  const trackComponentRender = (componentName: string, renderTime: number) => {
    setMetrics((prev) => ({
      ...prev,
      componentRenderTimes: {
        ...prev.componentRenderTimes,
        [componentName]: renderTime,
      },
    }))
  }

  // Track web vitals
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      // Track Time to First Byte (TTFB)
      const navigationEntries = performance.getEntriesByType("navigation")
      if (navigationEntries.length > 0) {
        const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming
        const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
        setMetrics((prev) => ({ ...prev, ttfb }))
      }

      // Track First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        if (entries.length > 0) {
          const fcp = entries[0].startTime
          setMetrics((prev) => ({ ...prev, fcp }))
          logger.info("First Contentful Paint", { fcp })
        }
      })

      try {
        fcpObserver.observe({ type: "paint", buffered: true })
      } catch (e) {
        logger.error("Failed to observe FCP", e as Error)
      }

      // Track Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1]
        if (lastEntry) {
          const lcp = lastEntry.startTime
          setMetrics((prev) => ({ ...prev, lcp }))
          logger.info("Largest Contentful Paint", { lcp })
        }
      })

      try {
        lcpObserver.observe({ type: "largest-contentful-paint", buffered: true })
      } catch (e) {
        logger.error("Failed to observe LCP", e as Error)
      }

      // Track Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value
            setMetrics((prev) => ({ ...prev, cls: clsValue }))
          }
        }
      })

      try {
        clsObserver.observe({ type: "layout-shift", buffered: true })
      } catch (e) {
        logger.error("Failed to observe CLS", e as Error)
      }

      // Track First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        if (entries.length > 0) {
          const firstInput = entries[0]
          const fid = firstInput.processingStart - firstInput.startTime
          setMetrics((prev) => ({ ...prev, fid }))
          logger.info("First Input Delay", { fid })
        }
      })

      try {
        fidObserver.observe({ type: "first-input", buffered: true })
      } catch (e) {
        logger.error("Failed to observe FID", e as Error)
      }

      // Clean up observers on unmount
      return () => {
        fcpObserver.disconnect()
        lcpObserver.disconnect()
        clsObserver.disconnect()
        fidObserver.disconnect()
      }
    }
  }, [])

  return <PerformanceContext.Provider value={{ metrics, trackComponentRender }}>{children}</PerformanceContext.Provider>
}

// Hook to use performance metrics
export function usePerformance() {
  return useContext(PerformanceContext)
}

// HOC to track component render time
export function withPerformanceTracking<P extends object>(Component: React.ComponentType<P>, componentName: string) {
  return function PerformanceTrackedComponent(props: P) {
    const { trackComponentRender } = usePerformance()
    const startTime = performance.now()

    useEffect(() => {
      const renderTime = performance.now() - startTime
      trackComponentRender(componentName, renderTime)
    }, [])

    return <Component {...props} />
  }
}

