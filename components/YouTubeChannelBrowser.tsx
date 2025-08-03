"use client"

import { useState } from "react"
import { Search, Users, List, ExternalLink, Plus } from "lucide-react"

interface Channel {
  id: string
  title: string
  description: string
  thumbnail: string
  subscriberCount: string
  videoCount: string
  viewCount: string
  url: string
  playlists: Playlist[]
}

interface Playlist {
  id: string
  title: string
  description: string
  thumbnail: string
  videoCount: number
  url: string
  publishedAt: string
}

export default function YouTubeChannelBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [channels, setChannels] = useState<Channel[]>([])
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPlaylists, setSelectedPlaylists] = useState<Set<string>>(new Set())

  const searchChannels = async (query: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query + " channel")}&maxResults=10`)
      const data = await response.json()

      // Filter for channels and get detailed info
      const channelResults = data.items.filter((item: any) => item.type === "channel")
      setChannels(channelResults)
    } catch (error) {
      console.error("Error searching channels:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadChannelDetails = async (channelId: string) => {
    try {
      const response = await fetch(`/api/youtube/channel?channelId=${channelId}`)
      const channelData = await response.json()
      setSelectedChannel(channelData)
    } catch (error) {
      console.error("Error loading channel details:", error)
    }
  }

  const togglePlaylistSelection = (playlistId: string) => {
    const newSelected = new Set(selectedPlaylists)
    if (newSelected.has(playlistId)) {
      newSelected.delete(playlistId)
    } else {
      newSelected.add(playlistId)
    }
    setSelectedPlaylists(newSelected)
  }

  const handleAddSelectedPlaylists = () => {
    if (selectedPlaylists.size === 0) return

    const selected = selectedChannel?.playlists.filter((p) => selectedPlaylists.has(p.id)) || []
    console.log("Adding playlists:", selected)

    alert(`Added ${selected.length} playlist${selected.length > 1 ? "s" : ""} to your collection!`)
    setSelectedPlaylists(new Set())
  }

  const formatNumber = (num: string) => {
    const number = Number.parseInt(num)
    if (number >= 1000000) {
      return `${(number / 1000000).toFixed(1)}M`
    } else if (number >= 1000) {
      return `${(number / 1000).toFixed(1)}K`
    }
    return number.toString()
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Browse YouTube Channels</h2>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && searchChannels(searchQuery)}
            placeholder="Search for educational channels..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => searchChannels(searchQuery)}
          disabled={!searchQuery.trim() || loading}
          className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Searching..." : "Search Channels"}
        </button>
      </div>

      {/* Channel Results */}
      {channels.length > 0 && !selectedChannel && (
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900">Found Channels:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => loadChannelDetails(channel.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={channel.thumbnail || "/placeholder.svg"}
                    alt={channel.title}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{channel.title}</h4>
                    <p className="text-sm text-gray-500">{formatNumber(channel.subscriberCount)} subscribers</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{channel.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Channel Details */}
      {selectedChannel && (
        <div className="space-y-6">
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={selectedChannel.thumbnail || "/placeholder.svg"}
              alt={selectedChannel.title}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{selectedChannel.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span>{formatNumber(selectedChannel.subscriberCount)} subscribers</span>
                <span>{formatNumber(selectedChannel.videoCount)} videos</span>
                <span>{formatNumber(selectedChannel.viewCount)} views</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{selectedChannel.description}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={selectedChannel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              <button
                onClick={() => setSelectedChannel(null)}
                className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors text-sm"
              >
                Back
              </button>
            </div>
          </div>

          {/* Selection Bar */}
          {selectedPlaylists.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 font-medium">
                  {selectedPlaylists.size} playlist{selectedPlaylists.size > 1 ? "s" : ""} selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPlaylists(new Set())}
                    className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleAddSelectedPlaylists}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Playlists */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Channel Playlists ({selectedChannel.playlists.length})</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedChannel.playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPlaylists.has(playlist.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => togglePlaylistSelection(playlist.id)}
                >
                  <div className="flex gap-3">
                    <img
                      src={playlist.thumbnail || "/placeholder.svg?height=60&width=80"}
                      alt={playlist.title}
                      className="w-20 h-14 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-900 line-clamp-2 mb-1">{playlist.title}</h5>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <List className="h-3 w-3" />
                        <span>{playlist.videoCount} videos</span>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(playlist.publishedAt).toLocaleDateString()}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-1 ${
                        selectedPlaylists.has(playlist.id) ? "bg-blue-600 border-blue-600" : "border-gray-300"
                      }`}
                    >
                      {selectedPlaylists.has(playlist.id) && (
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
          </div>
        </div>
      )}
    </div>
  )
}
