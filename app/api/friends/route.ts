import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { sendFriendRequest, getFriends, acceptFriendRequest } from "@/lib/database"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const friends = await getFriends(session.user.id)
    return NextResponse.json(friends)
  } catch (error) {
    console.error("Error fetching friends:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, friendEmail, friendId } = await request.json()

    if (action === "send") {
      const result = await sendFriendRequest(session.user.id, friendEmail)
      return NextResponse.json(result)
    } else if (action === "accept") {
      await acceptFriendRequest(session.user.id, friendId)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error handling friend request:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
