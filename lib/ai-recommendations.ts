import { supabase } from "./supabase"
import { getUserStats, getLearningHistory } from "./database"

interface RecommendationData {
  userId: string
  completedVideos: string[]
  learningHistory: any[]
  preferences: {
    categories: string[]
    difficulty: string
    duration: string
  }
}

export async function generateRecommendations(userId: string) {
  try {
    // Get user's learning data
    const stats = await getUserStats(userId)
    const history = await getLearningHistory(userId, 90) // Last 90 days

    // Get completed videos with categories
    const { data: completedVideos } = await supabase
      .from("user_progress")
      .select(`
        videos (
          title,
          description,
          playlist_id,
          playlists (
            title,
            channel_title
          )
        )
      `)
      .eq("user_id", userId)
      .eq("completed", true)

    // Analyze learning patterns
    const patterns = analyzeLearningPatterns(history)
    const preferences = extractPreferences(completedVideos)

    // Generate recommendations based on patterns
    const recommendations = await getYouTubeRecommendations({
      userId,
      patterns,
      preferences,
      stats,
    })

    return recommendations
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return []
  }
}

function analyzeLearningPatterns(history: any[]) {
  const patterns = {
    preferredDays: [] as string[],
    averageSessionLength: 0,
    consistencyScore: 0,
    growthTrend: "stable" as "growing" | "stable" | "declining",
  }

  if (history.length === 0) return patterns

  // Calculate preferred days
  const dayCount = history.reduce(
    (acc, session) => {
      const day = new Date(session.date).getDay()
      acc[day] = (acc[day] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  patterns.preferredDays = Object.entries(dayCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([day]) => dayNames[Number.parseInt(day)])

  // Calculate average session length
  patterns.averageSessionLength = history.reduce((sum, session) => sum + session.watch_time, 0) / history.length

  // Calculate consistency score (percentage of days with activity)
  patterns.consistencyScore = (history.length / 90) * 100

  // Determine growth trend
  const firstHalf = history.slice(0, Math.floor(history.length / 2))
  const secondHalf = history.slice(Math.floor(history.length / 2))

  const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.watch_time, 0) / firstHalf.length
  const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.watch_time, 0) / secondHalf.length

  if (secondHalfAvg > firstHalfAvg * 1.1) patterns.growthTrend = "growing"
  else if (secondHalfAvg < firstHalfAvg * 0.9) patterns.growthTrend = "declining"

  return patterns
}

function extractPreferences(completedVideos: any[]) {
  const categories = new Map<string, number>()
  const channels = new Map<string, number>()

  completedVideos?.forEach((video) => {
    const playlist = video.videos?.playlists
    if (playlist?.channel_title) {
      channels.set(playlist.channel_title, (channels.get(playlist.channel_title) || 0) + 1)
    }

    // Extract categories from titles and descriptions
    const text = `${video.videos?.title} ${video.videos?.description}`.toLowerCase()
    const techKeywords = [
      "javascript",
      "python",
      "react",
      "node",
      "css",
      "html",
      "programming",
      "coding",
      "development",
    ]
    const designKeywords = ["design", "ui", "ux", "figma", "photoshop", "creative"]
    const businessKeywords = ["business", "marketing", "entrepreneurship", "finance", "management"]

    if (techKeywords.some((keyword) => text.includes(keyword))) {
      categories.set("Technology", (categories.get("Technology") || 0) + 1)
    }
    if (designKeywords.some((keyword) => text.includes(keyword))) {
      categories.set("Design", (categories.get("Design") || 0) + 1)
    }
    if (businessKeywords.some((keyword) => text.includes(keyword))) {
      categories.set("Business", (categories.get("Business") || 0) + 1)
    }
  })

  return {
    topCategories: Array.from(categories.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category),
    topChannels: Array.from(channels.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([channel]) => channel),
  }
}

async function getYouTubeRecommendations(data: {
  userId: string
  patterns: any
  preferences: any
  stats: any
}) {
  const recommendations = []

  // Based on learning patterns, suggest optimal content
  if (data.patterns.growthTrend === "growing") {
    recommendations.push({
      type: "challenge",
      title: "Level Up Challenge",
      description: "You're on fire! Try these advanced topics to keep growing.",
      query: `${data.preferences.topCategories[0]} advanced tutorial`,
      reason: "Your learning is accelerating - time for more challenging content!",
    })
  }

  if (data.patterns.consistencyScore > 70) {
    recommendations.push({
      type: "streak",
      title: "Consistency Bonus",
      description: "Reward your consistency with these curated playlists.",
      query: `${data.preferences.topCategories[0]} complete course`,
      reason: "Your consistency deserves comprehensive learning materials!",
    })
  }

  // Suggest content based on preferred categories
  data.preferences.topCategories.forEach((category: string, index: number) => {
    recommendations.push({
      type: "category",
      title: `More ${category}`,
      description: `Continue your ${category.toLowerCase()} journey with these recommendations.`,
      query: `${category} tutorial 2024`,
      reason: `You've shown strong interest in ${category}`,
    })
  })

  // Suggest content from successful channels
  if (data.preferences.topChannels.length > 0) {
    recommendations.push({
      type: "channel",
      title: "From Your Favorite Creators",
      description: "New content from channels you love.",
      query: `${data.preferences.topChannels[0]} latest`,
      reason: "From creators you've learned from before",
    })
  }

  // Time-based recommendations
  if (data.patterns.averageSessionLength < 30) {
    recommendations.push({
      type: "duration",
      title: "Quick Learning Bites",
      description: "Short videos perfect for your learning style.",
      query: `${data.preferences.topCategories[0]} quick tutorial under 15 minutes`,
      reason: "Optimized for your preferred session length",
    })
  } else {
    recommendations.push({
      type: "duration",
      title: "Deep Dive Sessions",
      description: "Comprehensive content for focused learning.",
      query: `${data.preferences.topCategories[0]} complete guide`,
      reason: "Perfect for your longer learning sessions",
    })
  }

  return recommendations.slice(0, 6) // Return top 6 recommendations
}

export async function getPersonalizedPlaylistSuggestions(userId: string) {
  const recommendations = await generateRecommendations(userId)

  // Convert recommendations to YouTube search queries
  const suggestions = await Promise.all(
    recommendations.map(async (rec) => {
      try {
        const response = await fetch(
          `/api/youtube/search?q=${encodeURIComponent(rec.query)}&type=playlist&maxResults=3`,
        )
        const data = await response.json()

        return {
          ...rec,
          playlists: data.items || [],
        }
      } catch (error) {
        console.error("Error fetching playlist suggestions:", error)
        return { ...rec, playlists: [] }
      }
    }),
  )

  return suggestions.filter((s) => s.playlists.length > 0)
}
