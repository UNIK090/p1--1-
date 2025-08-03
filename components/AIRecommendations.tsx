"use client"

import { useState, useEffect } from "react"
import { Sparkles, Play, Clock, TrendingUp, Target, Zap } from "lucide-react"
import { useSession } from "next-auth/react"

interface Recommendation {
  type: string
  title: string
  description: string
  reason: string
  playlists: any[]
}

export default function AIRecommendations() {
  const { data: session } = useSession()
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null)

  useEffect(() => {
    if (session?.user?.id) {
      fetchRecommendations()
    }
  }, [session])

  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/recommendations")
      const data = await response.json()
      setRecommendations(data)
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "challenge":
        return <Target className="h-5 w-5 text-red-500" />
      case "streak":
        return <Zap className="h-5 w-5 text-yellow-500" />
      case "category":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      case "channel":
        return <Play className="h-5 w-5 text-purple-500" />
      case "duration":
        return <Clock className="h-5 w-5 text-green-500" />
      default:
        return <Sparkles className="h-5 w-5 text-pink-500" />
    }
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "challenge":
        return "from-red-50 to-orange-50 border-red-200"
      case "streak":
        return "from-yellow-50 to-orange-50 border-yellow-200"
      case "category":
        return "from-blue-50 to-indigo-50 border-blue-200"
      case "channel":
        return "from-purple-50 to-pink-50 border-purple-200"
      case "duration":
        return "from-green-50 to-emerald-50 border-green-200"
      default:
        return "from-pink-50 to-rose-50 border-pink-200"
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
        </div>
        <button onClick={fetchRecommendations} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Refresh
        </button>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8">
          <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Complete more videos to get personalized recommendations!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${getRecommendationColor(rec.type)} border rounded-lg p-4 cursor-pointer hover:shadow-md transition-all`}
              onClick={() => setSelectedRec(rec)}
            >
              <div className="flex items-start gap-3">
                {getRecommendationIcon(rec.type)}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <p className="text-xs text-gray-500 italic">{rec.reason}</p>
                  {rec.playlists.length > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700">{rec.playlists.length} playlists found</span>
                      <div className="flex -space-x-1">
                        {rec.playlists.slice(0, 3).map((playlist, i) => (
                          <img
                            key={i}
                            src={playlist.snippet.thumbnails?.default?.url || "/placeholder.svg?height=20&width=20"}
                            alt=""
                            className="w-5 h-5 rounded border border-white"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation Detail Modal */}
      {selectedRec && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRecommendationIcon(selectedRec.type)}
                  <h2 className="text-xl font-semibold text-gray-900">{selectedRec.title}</h2>
                </div>
                <button onClick={() => setSelectedRec(null)} className="text-gray-400 hover:text-gray-600">
                  ×
                </button>
              </div>
              <p className="text-gray-600 mt-2">{selectedRec.description}</p>
              <p className="text-sm text-blue-600 mt-1 italic">{selectedRec.reason}</p>
            </div>

            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recommended Playlists</h3>
              <div className="grid grid-cols-1 gap-4">
                {selectedRec.playlists.map((playlist, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <img
                      src={playlist.snippet.thumbnails?.medium?.url || "/placeholder.svg?height=60&width=60"}
                      alt={playlist.snippet.title}
                      className="w-15 h-15 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 line-clamp-2">{playlist.snippet.title}</h4>
                      <p className="text-sm text-gray-600">{playlist.snippet.channelTitle}</p>
                      <p className="text-xs text-gray-500 mt-1">{playlist.contentDetails?.itemCount || "N/A"} videos</p>
                    </div>
                    <button
                      onClick={() => {
                        // Add playlist logic here
                        console.log("Add playlist:", playlist)
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
