import { ClerkProvider } from "@clerk/nextjs";
import { ConvexProvider } from "@/providers/convex-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Next.js Full Stack Boilerplate",
  description: "A complete Next.js boilerplate with Clerk, Convex, and more",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <ConvexProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster />
            </ThemeProvider>
          </ConvexProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
