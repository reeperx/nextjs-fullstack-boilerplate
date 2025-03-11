"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useFeatureFlags, Feature } from "@/providers/feature-flags-provider"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { isEnabled } = useFeatureFlags()

  const routes = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: "layout",
    },
    {
      label: "Profile",
      href: "/dashboard/profile",
      icon: "user",
    },
    {
      label: "Payments",
      href: "/dashboard/payments",
      icon: "credit-card",
    },
    {
      label: "Email",
      href: "/dashboard/email",
      icon: "mail",
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ]

  // Add feature flags admin if beta features are enabled
  if (isEnabled(Feature.BETA_FEATURES)) {
    routes.push({
      label: "Feature Flags",
      href: "/dashboard/feature-flags",
      icon: "toggle-left",
    })
  }

  return (
    <nav className="hidden md:block w-64 border-r bg-background p-6">
      <div className="space-y-4">
        <div className="py-2">
          <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
        </div>
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("w-full justify-start", {
                "bg-secondary": pathname === route.href,
              })}
              asChild
            >
              <Link href={route.href}>
                <span className="mr-2">
                  {/* Use Lucide icons based on the icon name */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {route.icon === "layout" && (
                      <>
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <line x1="3" x2="21" y1="9" y2="9" />
                        <line x1="9" x2="9" y1="21" y2="9" />
                      </>
                    )}
                    {route.icon === "user" && (
                      <>
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </>
                    )}
                    {route.icon === "credit-card" && (
                      <>
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </>
                    )}
                    {route.icon === "mail" && (
                      <>
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </>
                    )}
                    {route.icon === "settings" && (
                      <>
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    )}
                    {route.icon === "toggle-left" && (
                      <>
                        <rect width="20" height="12" x="2" y="6" rx="6" ry="6" />
                        <circle cx="8" cy="12" r="2" />
                      </>
                    )}
                  </svg>
                </span>
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}

