import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { FirebaseAuthProvider } from "@/components/FirebaseAuthProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LearnSync - Track Your YouTube Learning Journey",
  description: "Track your YouTube learning progress, maintain streaks, and get personalized email reminders.",
  keywords: "learning, youtube, education, progress tracking, streaks",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
      </body>
    </html>
  )
}
