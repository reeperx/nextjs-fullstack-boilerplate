"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Feature } from "@/providers/feature-flags-provider"

// Feature flag configuration type
type FeatureConfig = {
  [key in Feature]: {
    enabled: boolean
    rolloutPercentage?: number
    enabledForUsers?: string[]
  }
}

export function FeatureFlagAdmin() {
  const [featureConfig, setFeatureConfig] = useState<FeatureConfig>({
    [Feature.NEW_DASHBOARD]: {
      enabled: false,
      rolloutPercentage: 10,
    },
    [Feature.ADVANCED_ANALYTICS]: {
      enabled: false,
      enabledForUsers: [],
    },
    [Feature.BETA_FEATURES]: {
      enabled: false,
    },
    [Feature.DARK_MODE]: {
      enabled: true,
    },
  })

  const [newUser, setNewUser] = useState("")

  // Load feature flags from local storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedConfig = localStorage.getItem("featureFlags")
      if (storedConfig) {
        setFeatureConfig(JSON.parse(storedConfig))
      }
    }
  }, [])

  // Save feature flags to local storage
  const saveFeatureFlags = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("featureFlags", JSON.stringify(featureConfig))
      alert("Feature flags saved successfully!")
    }
  }

  // Toggle feature enabled state
  const toggleFeature = (feature: Feature) => {
    setFeatureConfig((prev) => ({
      ...prev,
      [feature]: {
        ...prev[feature],
        enabled: !prev[feature].enabled,
      },
    }))
  }

  // Update rollout percentage
  const updateRolloutPercentage = (feature: Feature, value: string) => {
    const percentage = Number.parseInt(value, 10)
    if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
      setFeatureConfig((prev) => ({
        ...prev,
        [feature]: {
          ...prev[feature],
          rolloutPercentage: percentage,
        },
      }))
    }
  }

  // Add user to enabled users list
  const addUserToFeature = (feature: Feature) => {
    if (newUser.trim() === "") return

    setFeatureConfig((prev) => {
      const enabledForUsers = prev[feature].enabledForUsers || []
      if (!enabledForUsers.includes(newUser)) {
        return {
          ...prev,
          [feature]: {
            ...prev[feature],
            enabledForUsers: [...enabledForUsers, newUser],
          },
        }
      }
      return prev
    })

    setNewUser("")
  }

  // Remove user from enabled users list
  const removeUserFromFeature = (feature: Feature, user: string) => {
    setFeatureConfig((prev) => {
      const enabledForUsers = prev[feature].enabledForUsers || []
      return {
        ...prev,
        [feature]: {
          ...prev[feature],
          enabledForUsers: enabledForUsers.filter((u) => u !== user),
        },
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Feature Flag Administration</h1>
        <Button onClick={saveFeatureFlags}>Save Changes</Button>
      </div>

      {Object.values(Feature).map((feature) => (
        <Card key={feature}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{formatFeatureName(feature)}</CardTitle>
              <Switch
                checked={featureConfig[feature as Feature].enabled}
                onCheckedChange={() => toggleFeature(feature as Feature)}
              />
            </div>
            <CardDescription>{getFeatureDescription(feature as Feature)}</CardDescription>
          </CardHeader>
          <CardContent>
            {feature === Feature.NEW_DASHBOARD && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rollout-percentage">Rollout Percentage</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="rollout-percentage"
                      type="number"
                      min="0"
                      max="100"
                      value={featureConfig[feature].rolloutPercentage || 0}
                      onChange={(e) => updateRolloutPercentage(feature as Feature, e.target.value)}
                      className="w-24"
                    />
                    <span>%</span>
                  </div>
                </div>
              </div>
            )}

            {feature === Feature.ADVANCED_ANALYTICS && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="enabled-users">Enabled Users</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="enabled-users"
                      value={newUser}
                      onChange={(e) => setNewUser(e.target.value)}
                      placeholder="Enter user ID"
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => addUserToFeature(feature as Feature)}>
                      Add
                    </Button>
                  </div>
                </div>

                {featureConfig[feature].enabledForUsers && featureConfig[feature].enabledForUsers!.length > 0 && (
                  <div className="space-y-2">
                    <Label>Enabled User IDs</Label>
                    <div className="flex flex-wrap gap-2">
                      {featureConfig[feature].enabledForUsers!.map((user) => (
                        <div
                          key={user}
                          className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                        >
                          {user}
                          <button
                            className="ml-2 text-muted-foreground hover:text-foreground"
                            onClick={() => removeUserFromFeature(feature as Feature, user)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Helper function to format feature name
function formatFeatureName(feature: string): string {
  return feature
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

// Helper function to get feature description
function getFeatureDescription(feature: Feature): string {
  switch (feature) {
    case Feature.NEW_DASHBOARD:
      return "Enable the new dashboard interface with improved analytics and visualizations."
    case Feature.ADVANCED_ANALYTICS:
      return "Enable advanced analytics features for specific users."
    case Feature.BETA_FEATURES:
      return "Enable experimental features that are still in development."
    case Feature.DARK_MODE:
      return "Enable dark mode support across the application."
    default:
      return ""
  }
}

