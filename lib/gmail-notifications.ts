import nodemailer from "nodemailer"

interface EmailTemplate {
  subject: string
  html: string
}

interface UserStats {
  name: string
  email: string
  streak: number
  videosWatched: number
  timeSpent: number
  weeklyProgress?: {
    videosCompleted: number
    timeSpent: number
    streakDays: number
    achievements: string[]
  }
}

export class GmailNotificationService {
  private transporter: nodemailer.Transporter

  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    })
  }

  private getBaseTemplate(content: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>LearnSync Notification</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center; }
        .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
        .tagline { color: rgba(255,255,255,0.9); font-size: 14px; }
        .content { padding: 40px 30px; }
        .footer { background-color: #f1f5f9; padding: 20px 30px; text-align: center; color: #64748b; font-size: 12px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .stats { background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; }
        .stat-item { display: flex; justify-content: space-between; margin: 10px 0; }
        .achievement { background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; margin: 5px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎓 LearnSync</div>
          <div class="tagline">Your Learning Journey Companion</div>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          <p>Keep learning, keep growing! 🚀</p>
          <p>© 2024 LearnSync. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `
  }

  public getDailyReminderTemplate(userStats: UserStats): EmailTemplate {
    const content = `
      <h2 style="color: #1e293b; margin-bottom: 20px;">Don't Break Your Streak! 🔥</h2>
      <p style="color: #475569; font-size: 16px; line-height: 1.6;">
        Hi ${userStats.name}! Your ${userStats.streak}-day learning streak is waiting for you.
      </p>
      <div class="stats">
        <div class="stat-item">
          <span>Current Streak:</span>
          <strong style="color: #dc2626;">${userStats.streak} days 🔥</strong>
        </div>
        <div class="stat-item">
          <span>Videos Watched:</span>
          <strong>${userStats.videosWatched}</strong>
        </div>
        <div class="stat-item">
          <span>Time Spent Learning:</span>
          <strong>${Math.floor(userStats.timeSpent / 60)}h ${userStats.timeSpent % 60}m</strong>
        </div>
      </div>
      <p style="color: #475569; font-size: 16px; line-height: 1.6;">
        Just 10 minutes of learning today will keep your streak alive! 💪
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">Continue Learning</a>
    `

    return {
      subject: `🔥 Don't break your ${userStats.streak}-day streak!`,
      html: this.getBaseTemplate(content),
    }
  }

  public getWeeklyReportTemplate(userStats: UserStats): EmailTemplate {
    const { weeklyProgress } = userStats
    if (!weeklyProgress) throw new Error("Weekly progress data required")

    const content = `
      <h2 style="color: #1e293b; margin-bottom: 20px;">Your Weekly Learning Report 📊</h2>
      <p style="color: #475569; font-size: 16px; line-height: 1.6;">
        Hi ${userStats.name}! Here's your amazing progress from this week:
      </p>
      <div class="stats">
        <div class="stat-item">
          <span>Videos Completed:</span>
          <strong style="color: #059669;">${weeklyProgress.videosCompleted} videos 🎥</strong>
        </div>
        <div class="stat-item">
          <span>Time Invested:</span>
          <strong style="color: #7c3aed;">${Math.floor(weeklyProgress.timeSpent / 60)}h ${weeklyProgress.timeSpent % 60}m ⏰</strong>
        </div>
        <div class="stat-item">
          <span>Learning Streak:</span>
          <strong style="color: #dc2626;">${weeklyProgress.streakDays} days 🔥</strong>
        </div>
      </div>
      ${
        weeklyProgress.achievements.length > 0
          ? `
        <h3 style="color: #1e293b; margin: 30px 0 15px 0;">🏆 New Achievements</h3>
        <div>
          ${weeklyProgress.achievements.map((achievement) => `<span class="achievement">${achievement}</span>`).join("")}
        </div>
      `
          : ""
      }
      <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-top: 30px;">
        You're doing fantastic! Keep up the momentum! 🚀
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/analytics" class="btn">View Full Analytics</a>
    `

    return {
      subject: `📊 Your weekly learning report - ${weeklyProgress.videosCompleted} videos completed!`,
      html: this.getBaseTemplate(content),
    }
  }

  public getStreakCelebrationTemplate(userStats: UserStats): EmailTemplate {
    const milestones = {
      7: { emoji: "🎉", message: "One week strong!" },
      14: { emoji: "🔥", message: "Two weeks of dedication!" },
      30: { emoji: "🏆", message: "One month milestone!" },
      60: { emoji: "💎", message: "Two months of excellence!" },
      100: { emoji: "🚀", message: "Century club member!" },
    }

    const milestone = milestones[userStats.streak as keyof typeof milestones] || {
      emoji: "⭐",
      message: "Amazing consistency!",
    }

    const content = `
      <h2 style="color: #1e293b; margin-bottom: 20px;">${milestone.emoji} ${userStats.streak}-Day Streak Achievement!</h2>
      <p style="color: #475569; font-size: 18px; line-height: 1.6; text-align: center; margin: 30px 0;">
        <strong style="color: #dc2626; font-size: 24px;">${userStats.streak} DAYS</strong><br>
        ${milestone.message}
      </p>
      <div class="stats">
        <div class="stat-item">
          <span>Total Videos Watched:</span>
          <strong>${userStats.videosWatched} videos</strong>
        </div>
        <div class="stat-item">
          <span>Total Learning Time:</span>
          <strong>${Math.floor(userStats.timeSpent / 60)}h ${userStats.timeSpent % 60}m</strong>
        </div>
        <div class="stat-item">
          <span>Consistency Level:</span>
          <strong style="color: #059669;">Exceptional! 🌟</strong>
        </div>
      </div>
      <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
        You're building an incredible learning habit. Keep going! 💪
      </p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="btn">Continue Your Journey</a>
    `

    return {
      subject: `🎉 ${userStats.streak}-day learning streak achieved!`,
      html: this.getBaseTemplate(content),
    }
  }

  public async sendEmail(to: string, template: EmailTemplate): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: `"LearnSync" <${process.env.GMAIL_USER}>`,
        to,
        subject: template.subject,
        html: template.html,
      })

      console.log(`Email sent successfully to ${to}`)
      return true
    } catch (error) {
      console.error("Error sending email:", error)
      return false
    }
  }

  public async sendDailyReminder(userStats: UserStats): Promise<boolean> {
    const template = this.getDailyReminderTemplate(userStats)
    return this.sendEmail(userStats.email, template)
  }

  public async sendWeeklyReport(userStats: UserStats): Promise<boolean> {
    const template = this.getWeeklyReportTemplate(userStats)
    return this.sendEmail(userStats.email, template)
  }

  public async sendStreakCelebration(userStats: UserStats): Promise<boolean> {
    const template = this.getStreakCelebrationTemplate(userStats)
    return this.sendEmail(userStats.email, template)
  }
}
