"use client"

import { useState } from "react"
import { useAuth } from "./FirebaseAuthProvider"
import { usePathname, useRouter } from "next/navigation"
import { Home, Calendar, BarChart3, Settings, LogOut, Play, Moon, Sun, Zap } from "lucide-react"

export function Sidebar() {
  const { user, userProfile, signOut } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Calendar", path: "/calendar" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-2 relative">
            <Play className="h-6 w-6 text-white" fill="currentColor" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Learn
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Sync</span>
            </h1>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span>
                Level {Math.floor((userProfile?.totalVideosWatched || 0) / 10) + 1} •{" "}
                {userProfile?.totalVideosWatched || 0} XP
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
            return (
              <li key={item.label}>
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? "text-blue-600" : ""}`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>}
                </button>
              </li>
            )
          })}
        </ul>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Today's Progress</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Learning Streak</span>
              <span className="font-semibold text-blue-600">{userProfile?.learningStreak || 0} days 🔥</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "60%" }}></div>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">Videos watched</span>
              <span className="font-semibold text-purple-600">{userProfile?.totalVideosWatched || 0}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="text-sm font-medium">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img
              src={user?.photoURL || "/placeholder.svg?height=40&width=40&query=user+avatar"}
              alt={user?.displayName || "User"}
              className="w-10 h-10 rounded-full border-2 border-gray-200"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
