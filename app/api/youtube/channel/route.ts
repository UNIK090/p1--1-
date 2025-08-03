import { type NextRequest, NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const channelId = searchParams.get("channelId")
    const query = searchParams.get("q")

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 })
    }

    if (channelId) {
      // Get specific channel details and playlists
      const [channelResponse, playlistsResponse] = await Promise.all([
        fetch(
          `https://www.googleapis.com/youtube/v3/channels?` +
            `part=snippet,statistics&id=${channelId}&key=${YOUTUBE_API_KEY}`,
        ),
        fetch(
          `https://www.googleapis.com/youtube/v3/playlists?` +
            `part=snippet,contentDetails&channelId=${channelId}&` +
            `maxResults=20&key=${YOUTUBE_API_KEY}`,
        ),
      ])

      if (!channelResponse.ok || !playlistsResponse.ok) {
        throw new Error("YouTube API error")
      }

      const [channelData, playlistsData] = await Promise.all([channelResponse.json(), playlistsResponse.json()])

      return NextResponse.json({
        channel: channelData.items?.[0],
        playlists: playlistsData.items || [],
      })
    } else if (query) {
      // Search for channels
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?` +
          `part=snippet&type=channel&q=${encodeURIComponent(query)}&` +
          `maxResults=10&key=${YOUTUBE_API_KEY}`,
      )

      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`)
      }

      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ error: "channelId or q parameter is required" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching channel data:", error)
    return NextResponse.json({ error: "Failed to fetch channel data" }, { status: 500 })
  }
}
