import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/language-switcher"
import { AccessibilityMenu } from "@/components/accessibility-menu"

export default function HomePage() {
  const t = useTranslations("home")

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="flex items-center justify-center gap-2">
            <LanguageSwitcher />
            <AccessibilityMenu />
          </div>
        </div>
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-3 lg:text-left gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("features.auth.title")}</CardTitle>
            <CardDescription>{t("features.auth.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t("features.auth.content")}</p>
          </CardContent>
          <CardFooter>
            <Link href="/sign-in" passHref>
              <Button>{t("features.auth.action")}</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("features.database.title")}</CardTitle>
            <CardDescription>{t("features.database.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t("features.database.content")}</p>
          </CardContent>
          <CardFooter>
            <Link href="/docs/database" passHref>
              <Button variant="outline">{t("features.database.action")}</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("features.payments.title")}</CardTitle>
            <CardDescription>{t("features.payments.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t("features.payments.content")}</p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/payments" passHref>
              <Button variant="outline">{t("features.payments.action")}</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}

