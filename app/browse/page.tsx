"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import YouTubeChannelBrowser from "@/components/YouTubeChannelBrowser"
import { Search, TrendingUp, BookOpen, Code, Palette, Music } from "lucide-react"

export async function searchYouTubeVideos(query) {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
    query,
  )}&key=${apiKey}&maxResults=10`
  const res = await fetch(url)
  const data = await res.json()
  return data.items // Array of video results
}

export default function BrowsePage() {
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", label: "All Categories", icon: Search, color: "bg-gray-500" },
    { id: "programming", label: "Programming", icon: Code, color: "bg-blue-500" },
    { id: "design", label: "Design", icon: Palette, color: "bg-purple-500" },
    { id: "business", label: "Business", icon: TrendingUp, color: "bg-green-500" },
    { id: "education", label: "Education", icon: BookOpen, color: "bg-orange-500" },
    { id: "music", label: "Music", icon: Music, color: "bg-red-500" },
  ]

  const featuredChannels = [
    {
      id: "1",
      name: "freeCodeCamp.org",
      description: "Learn to code for free with millions of other students",
      subscribers: "8.2M",
      category: "programming",
      thumbnail: "/placeholder.svg?height=80&width=80",
      verified: true,
    },
    {
      id: "2",
      name: "Traversy Media",
      description: "Web development and programming tutorials",
      subscribers: "2.1M",
      category: "programming",
      thumbnail: "/placeholder.svg?height=80&width=80",
      verified: true,
    },
    {
      id: "3",
      name: "The Futur",
      description: "Design, business, and creative education",
      subscribers: "1.8M",
      category: "design",
      thumbnail: "/placeholder.svg?height=80&width=80",
      verified: true,
    },
    {
      id: "4",
      name: "Khan Academy",
      description: "Free world-class education for anyone, anywhere",
      subscribers: "7.4M",
      category: "education",
      thumbnail: "/placeholder.svg?height=80&width=80",
      verified: true,
    },
  ]

  const trendingTopics = [
    "React 2024",
    "Machine Learning",
    "UI/UX Design",
    "Python Programming",
    "Digital Marketing",
    "Data Science",
    "Web Development",
    "Mobile App Development",
  ]

  const filteredChannels = featuredChannels.filter(
    (channel) => activeCategory === "all" || channel.category === activeCategory,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Learning Content</h1>
          <p className="text-gray-600">Discover new channels, playlists, and educational content</p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Channel Browser */}
            <YouTubeChannelBrowser />

            {/* Featured Channels */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Featured Channels</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={channel.thumbnail || "/placeholder.svg"}
                        alt={channel.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{channel.name}</h3>
                          {channel.verified && (
                            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{channel.subscribers} subscribers</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{channel.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trending Topics</h3>
              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <button
                    key={index}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Discovery Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Channels Explored</span>
                  <span className="font-semibold text-blue-600">24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Playlists Added</span>
                  <span className="font-semibold text-purple-600">8</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Hours Discovered</span>
                  <span className="font-semibold text-green-600">156</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
