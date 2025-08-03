import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { createPlaylist, createVideos } from "@/lib/database"

// YouTube API helper function
async function fetchYouTubePlaylist(playlistId: string) {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    throw new Error("YouTube API key not configured")
  }

  // Fetch playlist details
  const playlistResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${apiKey}`,
  )

  if (!playlistResponse.ok) {
    throw new Error("Failed to fetch playlist from YouTube")
  }

  const playlistData = await playlistResponse.json()

  if (!playlistData.items || playlistData.items.length === 0) {
    throw new Error("Playlist not found")
  }

  const playlist = playlistData.items[0]

  // Fetch playlist videos
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${playlistId}&maxResults=50&key=${apiKey}`,
  )

  if (!videosResponse.ok) {
    throw new Error("Failed to fetch playlist videos")
  }

  const videosData = await videosResponse.json()

  // Get video durations
  const videoIds = videosData.items.map((item: any) => item.contentDetails.videoId).join(",")
  const durationsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${apiKey}`,
  )

  const durationsData = await durationsResponse.json()
  const durationMap = new Map()

  durationsData.items?.forEach((video: any) => {
    // Convert ISO 8601 duration to seconds
    const duration = video.contentDetails.duration
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    const hours = Number.parseInt(match[1] || "0")
    const minutes = Number.parseInt(match[2] || "0")
    const seconds = Number.parseInt(match[3] || "0")
    durationMap.set(video.id, hours * 3600 + minutes * 60 + seconds)
  })

  const videos = videosData.items.map((item: any, index: number) => ({
    youtube_id: item.contentDetails.videoId,
    title: item.snippet.title,
    description: item.snippet.description,
    thumbnail_url: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
    duration: durationMap.get(item.contentDetails.videoId) || 0,
    url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
    position: index,
  }))

  const totalDuration = videos.reduce((sum, video) => sum + video.duration, 0)

  return {
    youtube_id: playlistId,
    title: playlist.snippet.title,
    description: playlist.snippet.description,
    thumbnail_url: playlist.snippet.thumbnails?.medium?.url || playlist.snippet.thumbnails?.default?.url,
    channel_title: playlist.snippet.channelTitle,
    channel_id: playlist.snippet.channelId,
    video_count: videos.length,
    total_duration: totalDuration,
    url: `https://www.youtube.com/playlist?list=${playlistId}`,
    videos,
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    let { url, playlistData, videos } = body

    // Extract playlist ID from URL if not provided in body
    let playlistId = ""
    if (!playlistData || !videos) {
      const playlistIdMatch = url.match(/[?&]list=([^&]+)/)
      if (!playlistIdMatch) {
        return NextResponse.json({ error: "Invalid YouTube playlist URL" }, { status: 400 })
      }
      playlistId = playlistIdMatch[1]

      // Fetch playlist data from YouTube
      const fetchedPlaylistData = await fetchYouTubePlaylist(playlistId)
      playlistData = fetchedPlaylistData
      videos = fetchedPlaylistData.videos
    }

    // Create playlist
    const playlist = await createPlaylist(params.id, playlistData)

    // Create videos if provided
    if (videos && videos.length > 0) {
      await createVideos(playlist.id, videos)
    }

    return NextResponse.json(playlist)
  } catch (error) {
    console.error("Error creating playlist:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
