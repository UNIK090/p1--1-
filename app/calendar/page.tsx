"use client"

import { useState, useEffect } from "react"
import { Calendar, Flame, Target, TrendingUp } from "lucide-react"
import Sidebar from "@/components/Sidebar"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarData, setCalendarData] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    generateCalendarData()
  }, [])

  const generateCalendarData = () => {
    const data = []
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth() - 11, 1)

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)

      // Simulate learning activity
      const hasActivity = Math.random() > 0.3
      const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0
      const videosWatched = hasActivity ? Math.floor(Math.random() * 8) + 1 : 0
      const minutesLearned = hasActivity ? Math.floor(Math.random() * 180) + 30 : 0

      data.push({
        date: date.toISOString().split("T")[0],
        count: intensity,
        level: intensity,
        videosWatched,
        minutesLearned,
        streak: hasActivity,
      })
    }
    setCalendarData(data)
  }

  const getIntensityColor = (level: number) => {
    const colors = [
      "bg-gray-100 hover:bg-gray-200", // No activity
      "bg-green-200 hover:bg-green-300", // Low
      "bg-green-300 hover:bg-green-400", // Medium
      "bg-green-500 hover:bg-green-600", // High
      "bg-green-600 hover:bg-green-700", // Very high
    ]
    return colors[level] || colors[0]
  }

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const selectedDateData = selectedDate ? calendarData.find((d) => d.date === selectedDate) : null

  const stats = {
    totalDays: calendarData.filter((d) => d.level > 0).length,
    currentStreak: 12,
    longestStreak: 23,
    yearProgress: 68,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Learning Calendar</h1>
          </div>
          <p className="text-gray-600">Track your daily learning progress and build consistent habits</p>
        </div>

        {/* Calendar Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-100 rounded-lg p-2">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalDays}</div>
            </div>
            <div className="text-sm text-gray-600">Total learning days</div>
            <div className="text-xs text-green-600 font-medium mt-1">+5 this week</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-100 rounded-lg p-2">
                <Flame className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
            </div>
            <div className="text-sm text-gray-600">Current streak</div>
            <div className="text-xs text-orange-600 font-medium mt-1">Keep it up!</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 rounded-lg p-2">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.longestStreak}</div>
            </div>
            <div className="text-sm text-gray-600">Longest streak</div>
            <div className="text-xs text-purple-600 font-medium mt-1">Personal best</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 rounded-lg p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.yearProgress}%</div>
            </div>
            <div className="text-sm text-gray-600">This year</div>
            <div className="text-xs text-green-600 font-medium mt-1">Above average</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Heatmap */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">12 months of learning activity</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div key={level} className={`w-3 h-3 rounded-sm ${getIntensityColor(level).split(" ")[0]}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600">More</span>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-max">
                {/* Month labels */}
                <div className="flex gap-1 mb-2 ml-8">
                  {months.map((month, index) => (
                    <div key={month} className="text-xs text-gray-600 w-16 text-center">
                      {index % 2 === 0 ? month : ""}
                    </div>
                  ))}
                </div>

                {/* Weekday labels and calendar grid */}
                <div className="flex gap-1">
                  <div className="flex flex-col gap-1 mr-2">
                    {weekdays.map((day, index) => (
                      <div key={day} className="text-xs text-gray-600 h-3 flex items-center">
                        {index % 2 === 1 ? day : ""}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-53 gap-1">
                    {calendarData.map((day, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-sm ${getIntensityColor(day.level)} cursor-pointer transition-all`}
                        title={`${day.date}: ${day.videosWatched} videos, ${day.minutesLearned} minutes`}
                        onClick={() => setSelectedDate(day.date)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 text-xs text-gray-600">
              <p>Each square represents a day. Darker squares indicate more learning activity.</p>
            </div>
          </div>

          {/* Day Details & Recent Activity */}
          <div className="space-y-6">
            {/* Selected Day Details */}
            {selectedDateData && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {new Date(selectedDate!).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>

                {selectedDateData.level > 0 ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Videos Watched</span>
                      <span className="font-semibold">{selectedDateData.videosWatched}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Spent</span>
                      <span className="font-semibold">{selectedDateData.minutesLearned} min</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Activity Level</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < selectedDateData.level ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No learning activity on this day</p>
                )}
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  {
                    date: "Today",
                    activity: 'Completed 3 videos in "React Fundamentals"',
                    time: "2h 15m",
                    color: "bg-green-100 text-green-800",
                  },
                  {
                    date: "Yesterday",
                    activity: 'Watched 2 videos in "JavaScript Algorithms"',
                    time: "1h 30m",
                    color: "bg-blue-100 text-blue-800",
                  },
                  {
                    date: "2 days ago",
                    activity: 'Finished playlist "CSS Grid Mastery"',
                    time: "3h 45m",
                    color: "bg-purple-100 text-purple-800",
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${item.color.split(" ")[0]}`} />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{item.activity}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.date} • {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
