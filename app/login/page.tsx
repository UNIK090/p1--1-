"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/FirebaseAuthProvider"
import { GoogleSignInButton } from "@/components/GoogleSignInButton"
import { Play, Zap, Target, BarChart3 } from "lucide-react"

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 relative">
            <Play className="h-8 w-8 text-white" fill="currentColor" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              LearnSync
            </span>
          </h1>
          <p className="text-gray-600 leading-relaxed">
            Track your YouTube learning journey, maintain streaks, and get personalized email reminders to stay
            motivated.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Learning Streaks</h3>
            <p className="text-xs text-gray-500 mt-1">Build consistent habits</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <Target className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Smart Goals</h3>
            <p className="text-xs text-gray-500 mt-1">Track your progress</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Analytics</h3>
            <p className="text-xs text-gray-500 mt-1">Visualize learning</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <Play className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">YouTube Integration</h3>
            <p className="text-xs text-gray-500 mt-1">Seamless tracking</p>
          </div>
        </div>

        {/* Sign In Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Get Started</h2>
            <p className="text-gray-600 text-sm">
              Sign in with Google to start tracking your learning journey and receive personalized email reminders.
            </p>
          </div>

          <GoogleSignInButton />

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to receive email notifications about your learning progress and streaks.
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">✨ What you'll get:</p>
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              <span>Daily email reminders to maintain your streak</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              <span>Weekly progress reports with detailed analytics</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
              <span>Achievement celebrations and milestone alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
