import { Inter } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { ConvexProvider } from "@/providers/convex-provider"
import { AccessibilityProvider } from "@/providers/accessibility-provider"
import { FeatureFlagsProvider } from "@/providers/feature-flags-provider"
import { PerformanceProvider } from "@/providers/performance-provider"
import { Toaster } from "@/components/ui/toaster"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export async function generateMetadata({ params }) {
  const locale = params.locale

  return {
    title: {
      default: "Next.js Enterprise Boilerplate",
      template: "%s | Next.js Enterprise Boilerplate",
    },
    description: "A comprehensive Next.js boilerplate for enterprise applications",
    keywords: ["Next.js", "React", "JavaScript", "TypeScript", "Enterprise"],
    authors: [{ name: "Your Name" }],
    openGraph: {
      title: "Next.js Enterprise Boilerplate",
      description: "A comprehensive Next.js boilerplate for enterprise applications",
      url: "https://your-domain.com",
      siteName: "Next.js Enterprise Boilerplate",
      locale,
      type: "website",
    },
  }
}

export default async function RootLayout({ children, params }) {
  const locale = params.locale

  // Get messages for the current locale
  let messages
  try {
    messages = (await import(`@/messages/${locale}.json`)).default
  } catch (error) {
    // Fallback to default locale if messages for the current locale are not available
    messages = (await import(`@/messages/en.json`)).default
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClerkProvider>
            <ConvexProvider>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <AccessibilityProvider>
                  <FeatureFlagsProvider>
                    <PerformanceProvider>
                      {children}
                      <Toaster />
                    </PerformanceProvider>
                  </FeatureFlagsProvider>
                </AccessibilityProvider>
              </ThemeProvider>
            </ConvexProvider>
          </ClerkProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

