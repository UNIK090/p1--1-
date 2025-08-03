import { type NextRequest, NextResponse } from "next/server"

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")
    const type = searchParams.get("type") || "video"
    const maxResults = searchParams.get("maxResults") || "12"

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    if (!YOUTUBE_API_KEY) {
      return NextResponse.json({ error: "YouTube API key not configured" }, { status: 500 })
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&type=${type}&q=${encodeURIComponent(query)}&` +
        `maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`,
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()

    // If searching for playlists, get additional details
    if (type === "playlist" && data.items?.length > 0) {
      const playlistIds = data.items.map((item: any) => item.id.playlistId).join(",")

      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlists?` +
          `part=snippet,contentDetails&id=${playlistIds}&key=${YOUTUBE_API_KEY}`,
      )

      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json()

        // Merge search results with detailed info
        data.items = data.items.map((item: any) => {
          const details = detailsData.items.find((d: any) => d.id === item.id.playlistId)
          return {
            ...item,
            contentDetails: details?.contentDetails,
            snippet: { ...item.snippet, ...details?.snippet },
          }
        })
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error searching YouTube:", error)
    return NextResponse.json({ error: "Failed to search YouTube" }, { status: 500 })
  }
}
