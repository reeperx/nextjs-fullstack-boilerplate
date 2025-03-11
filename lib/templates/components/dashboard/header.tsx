"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { ModeToggle } from "@/components/theme-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { AccessibilityMenu } from "@/components/accessibility-menu"
import { useFeatureFlags, Feature } from "@/providers/feature-flags-provider"

export function DashboardHeader({ user }) {
  const { isEnabled } = useFeatureFlags()
  const showNewDashboard = isEnabled(Feature.NEW_DASHBOARD)

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-bold">
            {showNewDashboard ? "New Dashboard" : "Dashboard"}
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <AccessibilityMenu />
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}

