"use client"

import { useAccessibility } from "@/providers/accessibility-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function AccessibilityMenu() {
  const { highContrast, toggleHighContrast, largeText, toggleLargeText, reducedMotion, toggleReducedMotion } =
    useAccessibility()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
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
            className="mr-2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m7 9 2 2c1.3-1.3 3-2 5-2" />
            <path d="m19 15-2-2a7.9 7.9 0 0 0-5 2" />
          </svg>
          Accessibility
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Accessibility Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="flex items-center justify-between cursor-default">
            <Label htmlFor="high-contrast" className="cursor-pointer">
              High Contrast
            </Label>
            <Switch id="high-contrast" checked={highContrast} onCheckedChange={toggleHighContrast} />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-between cursor-default">
            <Label htmlFor="large-text" className="cursor-pointer">
              Large Text
            </Label>
            <Switch id="large-text" checked={largeText} onCheckedChange={toggleLargeText} />
          </DropdownMenuItem>
          <DropdownMenuItem className="flex items-center justify-between cursor-default">
            <Label htmlFor="reduced-motion" className="cursor-pointer">
              Reduced Motion
            </Label>
            <Switch id="reduced-motion" checked={reducedMotion} onCheckedChange={toggleReducedMotion} />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

