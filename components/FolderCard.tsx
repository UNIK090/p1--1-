"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreVertical, Play, Clock } from "lucide-react"

interface Folder {
  id: string
  name: string
  icon: string
  color: string
  playlists: any[]
  userId: string
  createdAt: Date
}

interface FolderCardProps {
  folder: Folder
}

export function FolderCard({ folder }: FolderCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800",
    purple: "bg-purple-50 border-purple-200 text-purple-800",
    orange: "bg-orange-50 border-orange-200 text-orange-800",
    red: "bg-red-50 border-red-200 text-red-800",
  }

  const totalVideos = folder.playlists.reduce((acc, playlist) => acc + playlist.videoCount, 0)
  const completedVideos = folder.playlists.reduce((acc, playlist) => acc + playlist.completedVideos, 0)
  const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0

  const handleClick = () => {
    router.push(`/folder/${folder.id}`)
  }

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer transform hover:-translate-y-1"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl transition-transform duration-200 ${
              colorClasses[folder.color as keyof typeof colorClasses]
            } ${isHovered ? "scale-110" : ""}`}
          >
            {folder.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{folder.name}</h3>
            <p className="text-sm text-gray-500">{folder.playlists.length} playlists</p>
          </div>
        </div>
        <button
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all"
          onClick={(e) => {
            e.stopPropagation()
            // Handle menu actions
          }}
        >
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Play className="h-4 w-4" />
          <span>
            {completedVideos}/{totalVideos}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{Math.floor((totalVideos * 10) / 60)}h</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-gray-100">
        <button
          className={`w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
            folder.playlists.length > 0
              ? "bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 border border-blue-200"
              : "bg-gray-50 hover:bg-gray-100 text-gray-700"
          }`}
        >
          {folder.playlists.length > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <Play className="h-4 w-4" />
              Continue Learning
            </div>
          ) : (
            "Add Playlists"
          )}
        </button>
      </div>

      {/* Hover Effects */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none" />
      )}
    </div>
  )
}

export default FolderCard
