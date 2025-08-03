"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/FirebaseAuthProvider"
import { Sidebar } from "@/components/Sidebar"
import { StatsCard } from "@/components/StatsCard"
import { FolderCard } from "@/components/FolderCard"
import { AddFolderModal } from "@/components/AddFolderModal"
import { QuickActions } from "@/components/QuickActions"
import { RecentActivity } from "@/components/RecentActivity"
import { Plus, Target, TrendingUp } from "lucide-react"
import { Play, Clock } from "lucide-react"

interface UserStats {
  total_videos_completed: number
  total_watch_time: number
  current_streak: number
  total_xp: number
}

interface Folder {
  id: string
  name: string
  description: string
  color: string
  playlist_count: number
  created_at: string
}

export default function DashboardPage() {
  const { user, userProfile, isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const [showAddFolder, setShowAddFolder] = useState(false)
  const [folders, setFolders] = useState([
    {
      id: "1",
      name: "Web Development",
      icon: "💻",
      color: "blue",
      playlists: [
        { id: "1", videoCount: 25, completedVideos: 15 },
        { id: "2", videoCount: 30, completedVideos: 8 },
      ],
      userId: "user1",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Data Science",
      icon: "📊",
      color: "green",
      playlists: [{ id: "3", videoCount: 40, completedVideos: 20 }],
      userId: "user1",
      createdAt: new Date(),
    },
  ])

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, loading, router])

  const handleAddFolder = async (folderData: any) => {
    // In a real app, this would make an API call
    const newFolder = {
      id: Date.now().toString(),
      ...folderData,
      playlists: [],
      userId: user?.uid || "",
      createdAt: new Date(),
    }
    setFolders((prev) => [...prev, newFolder])
    setShowAddFolder(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.displayName?.split(" ")[0] || "Learner"}! 👋
            </h1>
            <p className="text-gray-600">
              Ready to continue your learning journey? You're doing great with a {userProfile?.learningStreak || 0}-day
              streak!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Learning Streak"
              value={`${userProfile?.learningStreak || 0} days`}
              icon={<Target className="h-6 w-6 text-blue-600" />}
              color="blue"
              trend="+2 from yesterday"
              progress={75}
            />
            <StatsCard
              title="Videos Watched"
              value={userProfile?.totalVideosWatched?.toString() || "0"}
              icon={<Play className="h-6 w-6 text-green-600" />}
              color="green"
              trend="+5 this week"
            />
            <StatsCard
              title="Time Spent"
              value={`${Math.floor((userProfile?.totalTimeSpent || 0) / 60)}h ${(userProfile?.totalTimeSpent || 0) % 60}m`}
              icon={<Clock className="h-6 w-6 text-orange-600" />}
              color="orange"
              trend="+2.5h this week"
            />
            <StatsCard
              title="Progress"
              value="68%"
              icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
              color="purple"
              trend="↑ 12% this month"
              progress={68}
            />
          </div>

          {/* Quick Actions */}
          <QuickActions onAddFolder={() => setShowAddFolder(true)} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Folders Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Your Learning Folders</h2>
                <button
                  onClick={() => setShowAddFolder(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Folder
                </button>
              </div>

              {folders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {folders.map((folder) => (
                    <FolderCard key={folder.id} folder={folder} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No folders yet</h3>
                  <p className="text-gray-600 mb-4">Create your first learning folder to get started!</p>
                  <button
                    onClick={() => setShowAddFolder(true)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Folder
                  </button>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>

      {/* Add Folder Modal */}
      {showAddFolder && <AddFolderModal onClose={() => setShowAddFolder(false)} onAdd={handleAddFolder} />}
    </div>
  )
}
