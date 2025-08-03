"use client"

import { useState } from "react"
import { Check, Play, Clock, ExternalLink } from "lucide-react"

interface VideoCardProps {
  video: any
  index: number
  onToggleComplete: (videoId: string) => void
}

export default function VideoCard({ video, index, onToggleComplete }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`bg-white rounded-xl border p-4 flex items-center justify-between hover:shadow-md transition-all duration-200 ${
        video.completed ? "border-green-200 bg-green-50" : "border-gray-200"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4 flex-1">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            video.completed ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          {video.completed ? <Check className="h-4 w-4" /> : index}
        </div>

        <div className="flex-shrink-0">
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            className="w-24 h-16 object-cover rounded-lg"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold mb-1 ${
              video.completed ? "text-green-800 line-through" : "text-gray-900"
            }`}
          >
            {video.title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{video.duration}</span>
            </div>
            {video.completed && <span className="text-green-600 font-medium">✓ Completed</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3 rounded-full transition-all duration-200 ${
            isHovered ? "bg-red-600 text-white shadow-lg" : "bg-red-100 text-red-600 hover:bg-red-200"
          }`}
          title="Watch on YouTube"
        >
          {isHovered ? <ExternalLink className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </a>

        <button
          onClick={() => onToggleComplete(video.id)}
          className={`p-3 rounded-full transition-all duration-200 ${
            video.completed
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
          }`}
          title={video.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <Check className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
