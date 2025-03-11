"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type AccessibilityContextType = {
  highContrast: boolean
  toggleHighContrast: () => void
  largeText: boolean
  toggleLargeText: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  highContrast: false,
  toggleHighContrast: () => {},
  largeText: false,
  toggleLargeText: () => {},
  reducedMotion: false,
  toggleReducedMotion: () => {},
})

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighContrast = localStorage.getItem("highContrast") === "true"
      const savedLargeText = localStorage.getItem("largeText") === "true"
      const savedReducedMotion = localStorage.getItem("reducedMotion") === "true"

      setHighContrast(savedHighContrast)
      setLargeText(savedLargeText)
      setReducedMotion(savedReducedMotion)

      // Apply settings to document
      if (savedHighContrast) document.documentElement.classList.add("high-contrast")
      if (savedLargeText) document.documentElement.classList.add("large-text")
      if (savedReducedMotion) document.documentElement.classList.add("reduced-motion")
    }
  }, [])

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    setHighContrast((prev) => {
      const newValue = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("highContrast", String(newValue))
        if (newValue) {
          document.documentElement.classList.add("high-contrast")
        } else {
          document.documentElement.classList.remove("high-contrast")
        }
      }
      return newValue
    })
  }

  // Toggle large text mode
  const toggleLargeText = () => {
    setLargeText((prev) => {
      const newValue = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("largeText", String(newValue))
        if (newValue) {
          document.documentElement.classList.add("large-text")
        } else {
          document.documentElement.classList.remove("large-text")
        }
      }
      return newValue
    })
  }

  // Toggle reduced motion mode
  const toggleReducedMotion = () => {
    setReducedMotion((prev) => {
      const newValue = !prev
      if (typeof window !== "undefined") {
        localStorage.setItem("reducedMotion", String(newValue))
        if (newValue) {
          document.documentElement.classList.add("reduced-motion")
        } else {
          document.documentElement.classList.remove("reduced-motion")
        }
      }
      return newValue
    })
  }

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        toggleHighContrast,
        largeText,
        toggleLargeText,
        reducedMotion,
        toggleReducedMotion,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

// Hook to use accessibility settings
export function useAccessibility() {
  return useContext(AccessibilityContext)
}

