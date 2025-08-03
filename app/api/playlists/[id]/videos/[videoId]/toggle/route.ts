import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../auth/[...nextauth]/route"
import { toggleVideoCompletion, checkAndAwardAchievements, updateLearningSession } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string; videoId: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const progress = await toggleVideoCompletion(params.videoId, session.user.id)

    // If video was completed, update learning session and check achievements
    if (progress.completed) {
      const today = new Date().toISOString().split("T")[0]
      await updateLearningSession(session.user.id, today, {
        videos_completed: 1,
        xp_earned: 25, // Base XP per video
      })

      // Check for new achievements
      const newAchievements = await checkAndAwardAchievements(session.user.id)

      return NextResponse.json({
        progress,
        achievements: newAchievements,
      })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Error toggling video completion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
