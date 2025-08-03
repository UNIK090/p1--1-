"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Check, Play, Clock, BookOpen, Trophy, Share } from "lucide-react"
import VideoCard from "@/components/VideoCard"
import { searchYouTubeVideos } from "./path/to/your/utils"

export default function PlaylistPage() {
  const params = useParams()
  const router = useRouter()
  const [playlist, setPlaylist] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all") // all, completed, pending
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])

  useEffect(() => {
    fetchPlaylist()
  }, [params.id])

  const fetchPlaylist = async () => {
    try {
      const response = await fetch(`/api/playlists/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPlaylist(data)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching playlist:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleComplete = async (videoId: string) => {
    try {
      const response = await fetch(`/api/playlists/${params.id}/videos/${videoId}/toggle`, {
        method: "PATCH",
      })

      if (response.ok) {
        const updatedPlaylist = await response.json()
        setPlaylist(updatedPlaylist)
      }
    } catch (error) {
      console.error("Error toggling video completion:", error)
    }
  }

  const handleMarkAllComplete = async () => {
    try {
      const response = await fetch(`/api/playlists/${params.id}/complete-all`, {
        method: "PATCH",
      })

      if (response.ok) {
        const updatedPlaylist = await response.json()
        setPlaylist(updatedPlaylist)
      }
    } catch (error) {
      console.error("Error marking all complete:", error)
    }
  }

  const handleSearch = async () => {
    const videos = await searchYouTubeVideos(query)
    setResults(videos)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Playlist not found</h2>
          <button onClick={() => router.push("/dashboard")} className="text-blue-600 hover:text-blue-800">
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const filteredVideos = playlist.videos.filter((video: any) => {
    if (filter === "completed") return video.completed
    if (filter === "pending") return !video.completed
    return true
  })

  const progressPercentage = (playlist.completedVideos / playlist.videoCount) * 100
  const estimatedTimeRemaining = (playlist.videoCount - playlist.completedVideos) * 10 // Assume 10 min per video

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                navigator.share?.({
                  title: playlist.title,
                  url: window.location.href,
                })
              }
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        {/* Playlist Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-start gap-6">
            <img
              src={playlist.thumbnail || "/placeholder.svg?height=200&width=300&query=youtube+playlist"}
              alt={playlist.title}
              className="w-48 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{playlist.title}</h1>
              <p className="text-gray-600 mb-4">{playlist.description || "No description available"}</p>

              <div className="flex items-center gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{playlist.videoCount} videos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>~{Math.round(estimatedTimeRemaining / 60)}h remaining</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-4 w-4" />
                  <span>{Math.round(progressPercentage)}% complete</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>
                    {playlist.completedVideos} / {playlist.videoCount} completed
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <a
                  href={playlist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-red-700 transition-colors"
                >
                  <Play className="h-4 w-4" />
                  Watch on YouTube
                </a>
                {playlist.completedVideos < playlist.videoCount && (
                  <button
                    onClick={handleMarkAllComplete}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Mark All Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Videos</h2>
          <div className="flex gap-2">
            {[
              { key: "all", label: "All Videos" },
              { key: "pending", label: "Pending" },
              { key: "completed", label: "Completed" },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterOption.key
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Videos List */}
        <div className="space-y-4">
          {filteredVideos.map((video: any, index: number) => (
            <VideoCard key={video.id} video={video} index={index + 1} onToggleComplete={handleToggleComplete} />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              {filter === "completed"
                ? "No completed videos yet"
                : filter === "pending"
                  ? "All videos completed!"
                  : "No videos found"}
            </h3>
            <p className="text-gray-500">
              {filter === "completed"
                ? "Start watching to see your progress here"
                : filter === "pending"
                  ? "Congratulations on completing this playlist!"
                  : "This playlist appears to be empty"}
            </p>
          </div>
        )}

        {/* YouTube Search */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Search YouTube Videos</h2>
          <div className="flex gap-2 mb-4">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search YouTube videos"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>

          <ul className="space-y-2">
            {results.map(video => (
              <li key={video.id.videoId} className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
                <img
                  src={video.snippet.thumbnails.default.url}
                  alt={video.snippet.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <a
                    href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-gray-900 hover:underline"
                  >
                    {video.snippet.title}
                  </a>
                  <p className="text-sm text-gray-500">
                    {video.snippet.channelTitle} • {new Date(video.snippet.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
