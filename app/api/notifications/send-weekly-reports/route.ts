import { type NextRequest, NextResponse } from "next/server"
import { NotificationScheduler } from "@/lib/notification-scheduler"

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const scheduler = new NotificationScheduler()
    await scheduler.sendWeeklyReports()

    return NextResponse.json({ success: true, message: "Weekly reports sent" })
  } catch (error) {
    console.error("Error sending weekly reports:", error)
    return NextResponse.json({ error: "Failed to send reports" }, { status: 500 })
  }
}
