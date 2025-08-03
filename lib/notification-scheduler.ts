import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore"
import { db } from "./firebase"
import { GmailNotificationService } from "./gmail-notifications"

export class NotificationScheduler {
  private gmailService: GmailNotificationService

  constructor() {
    this.gmailService = new GmailNotificationService()
  }

  public async sendDailyReminders(): Promise<void> {
    try {
      // Get users who haven't completed videos today and have notifications enabled
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("emailNotifications", "==", true), where("learningStreak", ">", 0))

      const querySnapshot = await getDocs(q)
      const promises: Promise<boolean>[] = []

      querySnapshot.forEach((doc) => {
        const userData = doc.data()
        const userStats = {
          name: userData.displayName || "Learner",
          email: userData.email,
          streak: userData.learningStreak || 0,
          videosWatched: userData.totalVideosWatched || 0,
          timeSpent: userData.totalTimeSpent || 0,
        }

        promises.push(this.gmailService.sendDailyReminder(userStats))
      })

      const results = await Promise.allSettled(promises)
      const successful = results.filter((r) => r.status === "fulfilled" && r.value).length

      console.log(`Daily reminders sent: ${successful}/${results.length}`)
    } catch (error) {
      console.error("Error sending daily reminders:", error)
    }
  }

  public async sendWeeklyReports(): Promise<void> {
    try {
      const usersRef = collection(db, "users")
      const q = query(usersRef, where("emailNotifications", "==", true))

      const querySnapshot = await getDocs(q)
      const promises: Promise<boolean>[] = []

      querySnapshot.forEach((doc) => {
        const userData = doc.data()
        const userStats = {
          name: userData.displayName || "Learner",
          email: userData.email,
          streak: userData.learningStreak || 0,
          videosWatched: userData.totalVideosWatched || 0,
          timeSpent: userData.totalTimeSpent || 0,
          weeklyProgress: {
            videosCompleted: userData.weeklyVideos || 0,
            timeSpent: userData.weeklyTime || 0,
            streakDays: userData.learningStreak || 0,
            achievements: userData.recentAchievements || [],
          },
        }

        promises.push(this.gmailService.sendWeeklyReport(userStats))
      })

      const results = await Promise.allSettled(promises)
      const successful = results.filter((r) => r.status === "fulfilled" && r.value).length

      console.log(`Weekly reports sent: ${successful}/${results.length}`)
    } catch (error) {
      console.error("Error sending weekly reports:", error)
    }
  }

  public async checkAndCelebrateStreaks(): Promise<void> {
    try {
      const usersRef = collection(db, "users")
      const milestoneStreaks = [7, 14, 30, 60, 100]

      for (const milestone of milestoneStreaks) {
        const q = query(usersRef, where("emailNotifications", "==", true), where("learningStreak", "==", milestone))

        const querySnapshot = await getDocs(q)
        const promises: Promise<boolean>[] = []

        querySnapshot.forEach((doc) => {
          const userData = doc.data()
          const userStats = {
            name: userData.displayName || "Learner",
            email: userData.email,
            streak: userData.learningStreak || 0,
            videosWatched: userData.totalVideosWatched || 0,
            timeSpent: userData.totalTimeSpent || 0,
          }

          promises.push(this.gmailService.sendStreakCelebration(userStats))
        })

        await Promise.allSettled(promises)
      }
    } catch (error) {
      console.error("Error checking streaks:", error)
    }
  }

  public async updateUserActivity(userId: string, videoWatched = false): Promise<void> {
    try {
      const userRef = doc(db, "users", userId)
      const updateData: any = {
        lastActivityAt: new Date(),
      }

      if (videoWatched) {
        updateData.totalVideosWatched = increment(1)
        updateData.weeklyVideos = increment(1)
        updateData.totalTimeSpent = increment(10) // Assume 10 minutes per video
        updateData.weeklyTime = increment(10)
      }

      await updateDoc(userRef, updateData)
    } catch (error) {
      console.error("Error updating user activity:", error)
    }
  }
}
