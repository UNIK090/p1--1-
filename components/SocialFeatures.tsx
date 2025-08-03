"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Users, UserPlus, Trophy, Zap, Crown, Send } from "lucide-react"
import { useSession } from "next-auth/react"

interface Friend {
  id: string
  profiles: {
    id: string
    display_name: string
    avatar_url: string
    current_streak: number
    level: number
    xp_points: number
  }
}

export default function SocialFeatures() {
  const { data: session } = useSession()
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendEmail, setFriendEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("friends")

  useEffect(() => {
    if (session?.user?.id) {
      fetchFriends()
    }
  }, [session])

  const fetchFriends = async () => {
    try {
      const response = await fetch("/api/friends")
      const data = await response.json()
      setFriends(data)
    } catch (error) {
      console.error("Error fetching friends:", error)
    }
  }

  const sendFriendRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!friendEmail.trim()) return

    try {
      setLoading(true)
      await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", friendEmail }),
      })

      setFriendEmail("")
      alert("Friend request sent!")
    } catch (error) {
      console.error("Error sending friend request:", error)
      alert("Error sending friend request")
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (level: number) => {
    if (level >= 20) return <Crown className="h-4 w-4 text-yellow-500" />
    if (level >= 10) return <Trophy className="h-4 w-4 text-orange-500" />
    return <Zap className="h-4 w-4 text-blue-500" />
  }

  const sortedFriends = [...friends].sort((a, b) => b.profiles.xp_points - a.profiles.xp_points)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-6 w-6 text-blue-500" />
        <h2 className="text-lg font-semibold text-gray-900">Social Learning</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("friends")}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "friends"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Friends ({friends.length})
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "leaderboard"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Leaderboard
        </button>
      </div>

      {activeTab === "friends" && (
        <div className="space-y-4">
          {/* Add Friend Form */}
          <form onSubmit={sendFriendRequest} className="flex gap-2">
            <input
              type="email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              placeholder="Enter friend's email"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !friendEmail.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Add"}
            </button>
          </form>

          {/* Friends List */}
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No friends yet. Add some to compare progress!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={friend.profiles.avatar_url || "/placeholder.svg?height=40&width=40&query=user+avatar"}
                    alt={friend.profiles.display_name}
                    className="w-10 h-10 rounded-full border-2 border-gray-200"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{friend.profiles.display_name}</h3>
                      {getRankIcon(friend.profiles.level)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Level {friend.profiles.level}</span>
                      <span>{friend.profiles.xp_points} XP</span>
                      <span>{friend.profiles.current_streak} day streak</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <div className="space-y-3">
          {sortedFriends.length === 0 ? (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Add friends to see the leaderboard!</p>
            </div>
          ) : (
            sortedFriends.map((friend, index) => (
              <div
                key={friend.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  index === 0
                    ? "bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200"
                    : index === 1
                      ? "bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200"
                      : index === 2
                        ? "bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200"
                        : "bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200 font-bold text-sm">
                  {index + 1}
                </div>
                <img
                  src={friend.profiles.avatar_url || "/placeholder.svg?height=40&width=40&query=user+avatar"}
                  alt={friend.profiles.display_name}
                  className="w-10 h-10 rounded-full border-2 border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{friend.profiles.display_name}</h3>
                    {getRankIcon(friend.profiles.level)}
                    {index === 0 && <Crown className="h-4 w-4 text-yellow-500" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="font-semibold text-blue-600">{friend.profiles.xp_points} XP</span>
                    <span>Level {friend.profiles.level}</span>
                    <span>{friend.profiles.current_streak} day streak</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
