"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Play, Trash, MoreVertical, CheckCircle } from "lucide-react"

interface PlaylistCardProps {
  playlist: any
  onDelete: () => void
}

export default function PlaylistCard({ playlist, onDelete }: PlaylistCardProps) {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)

  const progressPercentage = playlist.videoCount > 0 ? (playlist.completedVideos / playlist.videoCount) * 100 : 0

  const handleClick = () => {
    router.push(`/playlist/${playlist.id}`)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer transform hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1" onClick={handleClick}>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {playlist.title}
          </h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Play className="h-4 w-4" />
              <span>{playlist.videoCount} videos</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>{playlist.completedVideos} completed</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                  setShowMenu(false)
                }}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <Trash className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div onClick={handleClick}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Thumbnail */}
        {playlist.thumbnail && (
          <img
            src={playlist.thumbnail || "/placeholder.svg"}
            alt={playlist.title}
            className="w-full h-32 object-cover rounded-lg mb-4"
          />
        )}

        {/* Action Button */}
        <button className="w-full bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 text-blue-700 py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2">
          <Play className="h-4 w-4" />
          {playlist.completedVideos > 0 ? "Continue Learning" : "Start Learning"}
        </button>
      </div>
    </div>
  )
}
