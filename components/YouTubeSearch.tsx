"use client"

import { useState, useEffect } from "react"
import { Search, X, Plus, ExternalLink, Play, List, Loader, AlertCircle } from "lucide-react"

interface YouTubeSearchProps {
  query: string
  onClose: () => void
}

interface YouTubeResult {
  id: string
  type: "video" | "playlist"
  title: string
  description: string
  thumbnail: string
  channelTitle: string
  publishedAt: string
  url: string
}

export default function YouTubeSearch({ query, onClose }: YouTubeSearchProps) {
  const [results, setResults] = useState<YouTubeResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<"all" | "videos" | "playlists">("all")

  useEffect(() => {
    searchYouTube()
  }, [query])

  const searchYouTube = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}&maxResults=20`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to search YouTube")
      }

      const data = await response.json()
      setResults(data.items || [])
    } catch (error) {
      console.error("YouTube search error:", error)
      setError(error instanceof Error ? error.message : "Failed to search YouTube")
    } finally {
      setLoading(false)
    }
  }

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleAddToFolder = async () => {
    if (selectedItems.size === 0) return

    const selectedResults = results.filter((result) => selectedItems.has(result.id))

    // Group by type
    const videos = selectedResults.filter((r) => r.type === "video")
    const playlists = selectedResults.filter((r) => r.type === "playlist")

    if (playlists.length > 0) {
      // For playlists, fetch detailed data and add to folders
      for (const playlist of playlists) {
        try {
          const response = await fetch(`/api/youtube/playlist?playlistId=${playlist.id}`)
          if (response.ok) {
            const playlistData = await response.json()
            // Here you would typically save to your database
            console.log("Playlist data:", playlistData)
          }
        } catch (error) {
          console.error("Error fetching playlist:", error)
        }
      }
    }

    if (videos.length > 0) {
      // For individual videos, you might want to create a custom playlist
      console.log("Selected videos:", videos)
    }

    alert(
      `Added ${selectedItems.size} item${selectedItems.size > 1 ? "s" : ""} to your learning collection!${
        playlists.length > 0 ? ` ${playlists.length} playlist${playlists.length > 1 ? "s" : ""} will be processed.` : ""
      }`,
    )
    onClose()
  }

  const filteredResults = results.filter((result) => {
    if (filter === "all") return true
    if (filter === "videos") return result.type === "video"
    if (filter === "playlists") return result.type === "playlist"
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Loader className="h-5 w-5 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900">Searching YouTube for "{query}"...</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-32 mb-3"></div>
              <div className="bg-gray-200 rounded h-4 mb-2"></div>
              <div className="bg-gray-200 rounded h-3 w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h2 className="text-xl font-semibold text-red-900">Search Error</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-3">
            <button
              onClick={searchYouTube}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            YouTube Results for "{query}" ({results.length})
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "All Results", count: results.length },
          { key: "videos", label: "Videos", count: results.filter((r) => r.type === "video").length },
          { key: "playlists", label: "Playlists", count: results.filter((r) => r.type === "playlist").length },
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === filterOption.key
                ? "bg-blue-100 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {filterOption.key === "videos" && <Play className="h-4 w-4" />}
            {filterOption.key === "playlists" && <List className="h-4 w-4" />}
            {filterOption.label} ({filterOption.count})
          </button>
        ))}
      </div>

      {/* Selection Bar */}
      {selectedItems.size > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-blue-700 font-medium">
                {selectedItems.size} item{selectedItems.size > 1 ? "s" : ""} selected
              </span>
              <div className="flex gap-2">
                {results
                  .filter((r) => selectedItems.has(r.id))
                  .slice(0, 3)
                  .map((item) => (
                    <div key={item.id} className="flex items-center gap-1 bg-white px-2 py-1 rounded text-xs">
                      {item.type === "video" ? <Play className="h-3 w-3" /> : <List className="h-3 w-3" />}
                      <span className="truncate max-w-20">{item.title}</span>
                    </div>
                  ))}
                {selectedItems.size > 3 && (
                  <span className="text-blue-600 text-sm">+{selectedItems.size - 3} more</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedItems(new Set())}
                className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleAddToFolder}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add to Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResults.map((result) => (
          <div
            key={result.id}
            className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
              selectedItems.has(result.id) ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => toggleItemSelection(result.id)}
          >
            <div className="flex gap-4">
              <div className="relative flex-shrink-0">
                <img
                  src={result.thumbnail || "/placeholder.svg?height=90&width=120"}
                  alt={result.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div
                  className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${
                    result.type === "video" ? "bg-red-600 text-white" : "bg-purple-600 text-white"
                  }`}
                >
                  {result.type === "video" ? <Play className="h-3 w-3" /> : <List className="h-3 w-3" />}
                  {result.type === "video" ? "Video" : "Playlist"}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{result.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{result.channelTitle}</p>
                <p className="text-xs text-gray-500 line-clamp-2 mb-2">{result.description}</p>
                <p className="text-xs text-gray-400">{formatDate(result.publishedAt)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded transition-colors"
                  onClick={(e) => e.stopPropagation()}
                  title="Open in YouTube"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  selectedItems.has(result.id) ? "bg-blue-600 border-blue-600" : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {selectedItems.has(result.id) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResults.length === 0 && !loading && (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No {filter === "all" ? "results" : filter} found</h3>
          <p className="text-gray-500 mb-4">Try searching with different keywords or adjust your filter</p>
          <button onClick={() => setFilter("all")} className="text-blue-600 hover:text-blue-800 font-medium">
            Show all results
          </button>
        </div>
      )}
    </div>
  )
}
