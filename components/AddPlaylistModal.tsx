"use client"

import type React from "react"

import { useState } from "react"
import { X, Link, Loader, CheckCircle, AlertCircle } from "lucide-react"

interface AddPlaylistModalProps {
  onClose: () => void
  onAdd: (playlist: any) => void
}

export default function AddPlaylistModal({ onClose, onAdd }: AddPlaylistModalProps) {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [playlistData, setPlaylistData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const extractPlaylistId = (url: string): string | null => {
    const patterns = [/[?&]list=([^#&?]*)/, /youtube\.com\/playlist\?list=([^#&?]*)/, /youtu\.be\/.*[?&]list=([^#&?]*)/]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }
    return null
  }

  const analyzePlaylist = async () => {
    if (!url.trim()) return

    const playlistId = extractPlaylistId(url)
    if (!playlistId) {
      setError("Invalid YouTube playlist URL. Please check the URL and try again.")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const response = await fetch(`/api/youtube/playlist?playlistId=${playlistId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch playlist data")
      }

      const data = await response.json()
      setPlaylistData(data)
    } catch (error) {
      console.error("Error analyzing playlist:", error)
      setError(error instanceof Error ? error.message : "Failed to analyze playlist")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (playlistData) {
      await onAdd(playlistData)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setPlaylistData(null)
    setError(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add YouTube Playlist</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playlistUrl" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Playlist URL
            </label>
            <div className="relative">
              <input
                type="url"
                id="playlistUrl"
                value={url}
                onChange={handleUrlChange}
                placeholder="https://www.youtube.com/playlist?list=..."
                className="w-full px-4 py-3 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Paste a YouTube playlist URL to automatically fetch playlist details
            </p>
          </div>

          {url && !playlistData && !isAnalyzing && !error && (
            <button
              type="button"
              onClick={analyzePlaylist}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Link className="h-4 w-4" />
              Analyze Playlist
            </button>
          )}

          {isAnalyzing && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-blue-600">
                <Loader className="h-5 w-5 animate-spin" />
                <span className="text-sm font-medium">Fetching playlist data from YouTube...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-900">Error</span>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                type="button"
                onClick={analyzePlaylist}
                className="mt-3 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          )}

          {playlistData && !isAnalyzing && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Playlist Found!</span>
              </div>

              <div className="flex gap-3 mb-4">
                <img
                  src={playlistData.thumbnail || "/placeholder.svg?height=80&width=120"}
                  alt="Playlist thumbnail"
                  className="w-20 h-14 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 text-sm mb-1">{playlistData.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{playlistData.channelTitle}</p>
                  <p className="text-xs text-green-600 font-medium">{playlistData.videoCount} videos</p>
                </div>
              </div>

              {playlistData.description && (
                <p className="text-xs text-gray-600 line-clamp-3 mb-3">{playlistData.description}</p>
              )}

              <div className="bg-white rounded p-3 border border-green-200">
                <h4 className="text-xs font-medium text-gray-900 mb-2">Preview Videos:</h4>
                <div className="space-y-1">
                  {playlistData.videos.slice(0, 3).map((video: any, index: number) => (
                    <div key={video.id} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400 w-4">{index + 1}.</span>
                      <span className="text-gray-700 truncate flex-1">{video.title}</span>
                      <span className="text-gray-500">{video.duration}</span>
                    </div>
                  ))}
                  {playlistData.videos.length > 3 && (
                    <p className="text-xs text-gray-500 text-center pt-1">
                      +{playlistData.videos.length - 3} more videos
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!playlistData || isAnalyzing}
            >
              {isAnalyzing ? "Analyzing..." : "Add Playlist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
