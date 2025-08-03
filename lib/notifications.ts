import webpush from "web-push"
import { getPushSubscriptions, createNotification } from "./database"

// Configure web-push
webpush.setVapidDetails(
  "mailto:your-email@example.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function sendPushNotification(
  userId: string,
  notification: {
    title: string
    message: string
    type: string
    data?: any
  },
) {
  try {
    // Save notification to database
    await createNotification(userId, notification)

    // Get user's push subscriptions
    const subscriptions = await getPushSubscriptions(userId)

    // Send push notification to all subscriptions
    const promises = subscriptions.map(async (subscription) => {
      const pushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      }

      const payload = JSON.stringify({
        title: notification.title,
        body: notification.message,
        icon: "/icon-192x192.png",
        badge: "/badge-72x72.png",
        data: notification.data,
      })

      try {
        await webpush.sendNotification(pushSubscription, payload)
      } catch (error) {
        console.error("Error sending push notification:", error)
        // Remove invalid subscription
        if (error.statusCode === 410) {
          // Subscription is no longer valid, remove it
          // This would require a database operation to remove the subscription
        }
      }
    })

    await Promise.all(promises)
  } catch (error) {
    console.error("Error in sendPushNotification:", error)
    throw error
  }
}

export async function sendDailyReminder(userId: string) {
  await sendPushNotification(userId, {
    title: "Don't break your streak! 🔥",
    message: "You haven't completed any videos today. Keep your learning momentum going!",
    type: "reminder",
    data: { action: "open_dashboard" },
  })
}

export async function sendWeeklyReport(userId: string, stats: any) {
  await sendPushNotification(userId, {
    title: "Weekly Learning Report 📊",
    message: `Great week! You completed ${stats.videosCompleted} videos and watched ${stats.watchTime} minutes.`,
    type: "report",
    data: { stats },
  })
}

export async function sendAchievementNotification(userId: string, achievement: any) {
  await sendPushNotification(userId, {
    title: "Achievement Unlocked! 🏆",
    message: `Congratulations! You've earned "${achievement.name}"`,
    type: "achievement",
    data: { achievement },
  })
}

export async function sendStreakAlert(userId: string, streak: number) {
  await sendPushNotification(userId, {
    title: `${streak} Day Streak! 🔥`,
    message: "Amazing consistency! Keep up the great work.",
    type: "streak",
    data: { streak },
  })
}
