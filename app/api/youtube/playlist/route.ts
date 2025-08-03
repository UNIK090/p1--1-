import { type NextRequest, NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

function extractPlaylistId(url: string): string | null {
  const patterns = [/[?&]list=([^&]+)/, /playlist\?list=([^&]+)/, /embed\/videoseries\?list=([^&]+)/]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = Number.parseInt(match[1] || "0")
  const minutes = Number.parseInt(match[2] || "0")
  const seconds = Number.parseInt(match[3] || "0")

  return hours * 3600 + minutes * 60 + seconds
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 })
    }

    const playlistId = extractPlaylistId(url)
    if (!playlistId) {
      return NextResponse.json({ error: "Invalid YouTube playlist URL" }, { status: 400 })
    }

    // Get playlist details
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?` +
        `part=snippet,contentDetails&id=${playlistId}&key=${YOUTUBE_API_KEY}`,
    )

    if (!playlistResponse.ok) {
      throw new Error(`YouTube API error: ${playlistResponse.status}`)
    }

    const playlistData = await playlistResponse.json()

    if (!playlistData.items || playlistData.items.length === 0) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 })
    }

    const playlist = playlistData.items[0]

    // Get playlist videos
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?` +
        `part=snippet,contentDetails&playlistId=${playlistId}&` +
        `maxResults=50&key=${YOUTUBE_API_KEY}`,
    )

    if (!videosResponse.ok) {
      throw new Error(`YouTube API error: ${videosResponse.status}`)
    }

    const videosData = await videosResponse.json()
    const videoIds = videosData.items
      ?.map((item: any) => item.contentDetails.videoId)
      .filter(Boolean)
      .join(",")

    // Get video details including duration
    let videos = []
    let totalDuration = 0

    if (videoIds) {
      const videoDetailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?` +
          `part=snippet,contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
      )

      if (videoDetailsResponse.ok) {
        const videoDetailsData = await videoDetailsResponse.json()

        videos =
          videoDetailsData.items?.map((video: any, index: number) => {
            const duration = parseDuration(video.contentDetails.duration)
            totalDuration += duration

            return {
              youtube_id: video.id,
              title: video.snippet.title,
              description: video.snippet.description,
              thumbnail_url: video.snippet.thumbnails?.medium?.url || video.snippet.thumbnails?.default?.url,
              duration,
              url: `https://www.youtube.com/watch?v=${video.id}`,
              position: index,
            }
          }) || []
      }
    }

    const result = {
      playlist: {
        youtube_id: playlistId,
        title: playlist.snippet.title,
        description: playlist.snippet.description,
        thumbnail_url: playlist.snippet.thumbnails?.medium?.url || playlist.snippet.thumbnails?.default?.url,
        channel_title: playlist.snippet.channelTitle,
        channel_id: playlist.snippet.channelId,
        video_count: playlist.contentDetails.itemCount,
        total_duration: totalDuration,
        url: url,
      },
      videos,
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching playlist:", error)
    return NextResponse.json({ error: "Failed to fetch playlist data" }, { status: 500 })
  }
}
