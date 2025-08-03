import { type NextRequest, NextResponse } from "next/server"
import { NotificationScheduler } from "@/lib/notification-scheduler"

export async function POST(request: NextRequest) {
  try {
    const { userId, videoWatched } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 })
    }

    const scheduler = new NotificationScheduler()
    await scheduler.updateUserActivity(userId, videoWatched)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user activity:", error)
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 })
  }
}

// class NotificationScheduler {
//   async updateUserActivity(userId: string, videoWatched: any) {
//     try {
//       const { videoId, playlistId, completed, watchTime, xpEarned } = videoWatched

//       if (!videoId) {
//         return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
//       }

//       // Record video progress
//       const { data: progress, error: progressError } = await supabase
//         .from("user_video_progress")
//         .upsert({
//           user_id: userId,
//           video_id: videoId,
//           playlist_id: playlistId,
//           completed: completed || false,
//           watch_time: watchTime || 0,
//           xp_earned: xpEarned || 0,
//           completed_at: completed ? new Date().toISOString() : null,
//           updated_at: new Date().toISOString(),
//         })
//         .select()
//         .single()

//       if (progressError) {
//         console.error("Error recording progress:", progressError)
//         return NextResponse.json({ error: "Failed to record progress" }, { status: 500 })
//       }

//       // If video was completed, update user stats and check for achievements
//       if (completed) {
//         // Update user stats
//         const { data: currentStats } = await supabase.from("user_stats").select("*").eq("user_id", userId).single()

//         const today = new Date().toISOString().split("T")[0]
//         const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

//         // Check if user completed videos yesterday to maintain streak
//         const { data: yesterdayActivity } = await supabase
//           .from("user_video_progress")
//           .select("*")
//           .eq("user_id", userId)
//           .eq("completed", true)
//           .gte("completed_at", `${yesterday}T00:00:00.000Z`)
//           .lt("completed_at", `${yesterday}T23:59:59.999Z`)

//         // Check if this is first video today
//         const { data: todayActivity } = await supabase
//           .from("user_video_progress")
//           .select("*")
//           .eq("user_id", userId)
//           .eq("completed", true)
//           .gte("completed_at", `${today}T00:00:00.000Z`)
//           .lt("completed_at", `${today}T23:59:59.999Z`)

//         const isFirstVideoToday = todayActivity?.length === 1

//         let newStreak = 1
//         if (currentStats) {
//           if (yesterdayActivity && yesterdayActivity.length > 0) {
//             // Continue streak
//             newStreak = isFirstVideoToday ? currentStats.current_streak + 1 : currentStats.current_streak
//           } else {
//             // Reset streak if no activity yesterday
//             newStreak = 1
//           }
//         }

//         const updatedStats = {
//           user_id: userId,
//           total_videos_completed: (currentStats?.total_videos_completed || 0) + 1,
//           total_watch_time: (currentStats?.total_watch_time || 0) + (watchTime || 0),
//           total_xp: (currentStats?.total_xp || 0) + (xpEarned || 0),
//           current_streak: newStreak,
//           longest_streak: Math.max(newStreak, currentStats?.longest_streak || 0),
//           last_activity_date: new Date().toISOString(),
//           updated_at: new Date().toISOString(),
//         }

//         const { error: statsError } = await supabase.from("user_stats").upsert(updatedStats)

//         if (statsError) {
//           console.error("Error updating stats:", statsError)
//         }

//         // Check for new achievements
//         await this.checkAndAwardAchievements(userId, updatedStats)
//       }
//     } catch (error) {
//       console.error("Error recording user activity:", error)
//     }
//   }

//   async checkAndAwardAchievements(userId: string, stats: any) {
//     try {
//       // Get all achievements
//       const { data: achievements } = await supabase.from("achievements").select("*")

//       if (!achievements) return

//       // Get user's current achievements
//       const { data: userAchievements } = await supabase
//         .from("user_achievements")
//         .select("achievement_id")
//         .eq("user_id", userId)

//       const earnedAchievementIds = userAchievements?.map((ua) => ua.achievement_id) || []

//       for (const achievement of achievements) {
//         // Skip if already earned
//         if (earnedAchievementIds.includes(achievement.id)) continue

//         let shouldAward = false

//         // Check achievement criteria
//         switch (achievement.criteria_type) {
//           case "videos_completed":
//             shouldAward = stats.total_videos_completed >= achievement.criteria_value
//             break
//           case "streak_days":
//             shouldAward = stats.current_streak >= achievement.criteria_value
//             break
//           case "watch_time":
//             shouldAward = stats.total_watch_time >= achievement.criteria_value
//             break
//           case "xp_earned":
//             shouldAward = stats.total_xp >= achievement.criteria_value
//             break
//         }

//         if (shouldAward) {
//           // Award achievement
//           const { error: awardError } = await supabase.from("user_achievements").insert({
//             user_id: userId,
//             achievement_id: achievement.id,
//             earned_at: new Date().toISOString(),
//           })

//           if (!awardError) {
//             // Send achievement notification
//             await this.sendAchievementNotification(userId, achievement.id)

//             // Update user's total XP with achievement reward
//             await supabase
//               .from("user_stats")
//               .update({
//                 total_xp: stats.total_xp + achievement.xp_reward,
//               })
//               .eq("user_id", userId)
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error checking achievements:", error)
//     }
//   }

//   async sendAchievementNotification(userId: string, achievementId: string) {
//     // Implementation for sending notifications
//     console.log(`Sending notification to user ${userId} for achievement ${achievementId}`)
//   }
// }
