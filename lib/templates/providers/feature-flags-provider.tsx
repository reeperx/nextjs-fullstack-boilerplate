"use client"

import type React from "react"

import { createContext, useContext, type ReactNode, useState, useEffect } from "react"
import { createLogger } from "@/lib/logger"

const logger = createLogger("feature-flags")

// Define your feature flags here
export enum Feature {
  NEW_DASHBOARD = "new_dashboard",
  ADVANCED_ANALYTICS = "advanced_analytics",
  BETA_FEATURES = "beta_features",
  DARK_MODE = "dark_mode",
}

// Feature flag configuration
type FeatureConfig = {
  [key in Feature]: {
    enabled: boolean
    rolloutPercentage?: number
    enabledForUsers?: string[]
  }
}

// Default configuration
const defaultFeatureConfig: FeatureConfig = {
  [Feature.NEW_DASHBOARD]: {
    enabled: false,
    rolloutPercentage: 10, // 10% of users
  },
  [Feature.ADVANCED_ANALYTICS]: {
    enabled: false,
    enabledForUsers: [], // Specific users only
  },
  [Feature.BETA_FEATURES]: {
    enabled: false,
  },
  [Feature.DARK_MODE]: {
    enabled: true, // Enabled for everyone
  },
}

// Feature flags context
type FeatureFlagsContextType = {
  isEnabled: (feature: Feature) => boolean
  features: Record<Feature, boolean>
  refreshFeatures: () => Promise<void>
}

const FeatureFlagsContext = createContext<FeatureFlagsContextType>({
  isEnabled: () => false,
  features: Object.values(Feature).reduce(
    (acc, feature) => {
      acc[feature as Feature] = false
      return acc
    },
    {} as Record<Feature, boolean>,
  ),
  refreshFeatures: async () => {},
})

// Provider component
export function FeatureFlagsProvider({
  children,
  userId,
}: {
  children: ReactNode
  userId?: string
}) {
  const [featureConfig, setFeatureConfig] = useState<FeatureConfig>(defaultFeatureConfig)
  const [features, setFeatures] = useState<Record<Feature, boolean>>(
    Object.values(Feature).reduce(
      (acc, feature) => {
        acc[feature as Feature] = false
        return acc
      },
      {} as Record<Feature, boolean>,
    ),
  )

  // Function to determine if a feature is enabled for the current user
  const isEnabled = (feature: Feature): boolean => {
    return features[feature] || false
  }

  // Function to fetch feature flags from API or local storage
  const fetchFeatureFlags = async (): Promise<FeatureConfig> => {
    try {
      // In a real app, you would fetch from an API
      // For now, we'll use the default config
      // const response = await fetch('/api/feature-flags');
      // return await response.json();

      // For demo purposes, we'll use local storage if available
      if (typeof window !== "undefined") {
        const storedConfig = localStorage.getItem("featureFlags")
        if (storedConfig) {
          return JSON.parse(storedConfig)
        }
      }

      return defaultFeatureConfig
    } catch (error) {
      logger.error("Failed to fetch feature flags", error as Error)
      return defaultFeatureConfig
    }
  }

  // Function to evaluate feature flags for the current user
  const evaluateFeatureFlags = (config: FeatureConfig, uid?: string): Record<Feature, boolean> => {
    return Object.values(Feature).reduce(
      (acc, feature) => {
        const featureKey = feature as Feature
        const featureSettings = config[featureKey]

        // Feature is globally enabled
        if (featureSettings.enabled) {
          acc[featureKey] = true
        }
        // Feature is enabled for specific users
        else if (uid && featureSettings.enabledForUsers?.includes(uid)) {
          acc[featureKey] = true
        }
        // Feature is enabled for a percentage of users
        else if (featureSettings.rolloutPercentage && featureSettings.rolloutPercentage > 0) {
          // Generate a consistent hash for the user ID
          const hash = uid ? hashString(uid) : Math.random()
          const normalizedHash = hash % 100

          acc[featureKey] = normalizedHash < featureSettings.rolloutPercentage
        } else {
          acc[featureKey] = false
        }

        return acc
      },
      {} as Record<Feature, boolean>,
    )
  }

  // Simple string hash function
  const hashString = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  // Function to refresh feature flags
  const refreshFeatures = async (): Promise<void> => {
    const config = await fetchFeatureFlags()
    setFeatureConfig(config)
    setFeatures(evaluateFeatureFlags(config, userId))
  }

  // Initialize feature flags
  useEffect(() => {
    refreshFeatures()
  }, [userId])

  return (
    <FeatureFlagsContext.Provider
      value={{
        isEnabled,
        features,
        refreshFeatures,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  )
}

// Hook to use feature flags
export function useFeatureFlags() {
  return useContext(FeatureFlagsContext)
}

// HOC to conditionally render components based on feature flags
export function withFeatureFlag(
  Component: React.ComponentType<any>,
  feature: Feature,
  FallbackComponent?: React.ComponentType<any>,
) {
  return function FeatureFlaggedComponent(props: any) {
    const { isEnabled } = useFeatureFlags()

    if (isEnabled(feature)) {
      return <Component {...props} />
    }

    if (FallbackComponent) {
      return <FallbackComponent {...props} />
    }

    return null
  }
}

