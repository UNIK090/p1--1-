"use client"

import { useState } from "react"
import { BarChart3, TrendingUp, Clock, Target, Download } from "lucide-react"
import Sidebar from "@/components/Sidebar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("videos")

  // Mock data for charts
  const weeklyData = [
    { day: "Mon", minutes: 120, videos: 8, xp: 240 },
    { day: "Tue", minutes: 90, videos: 6, xp: 180 },
    { day: "Wed", minutes: 150, videos: 10, xp: 300 },
    { day: "Thu", minutes: 80, videos: 5, xp: 160 },
    { day: "Fri", minutes: 110, videos: 7, xp: 220 },
    { day: "Sat", minutes: 200, videos: 13, xp: 400 },
    { day: "Sun", minutes: 160, videos: 11, xp: 320 },
  ]

  const monthlyProgress = [
    { month: "Jan", videos: 25, hours: 45, streak: 8 },
    { month: "Feb", videos: 32, hours: 58, streak: 12 },
    { month: "Mar", videos: 28, hours: 52, streak: 15 },
    { month: "Apr", videos: 35, hours: 63, streak: 18 },
    { month: "May", videos: 42, hours: 78, streak: 22 },
    { month: "Jun", videos: 38, hours: 69, streak: 25 },
  ]

  const categoryData = [
    { name: "Web Development", value: 35, color: "#3B82F6", hours: 45 },
    { name: "Data Structures", value: 25, color: "#8B5CF6", hours: 32 },
    { name: "IELTS Prep", value: 20, color: "#10B981", hours: 28 },
    { name: "Design", value: 15, color: "#F59E0B", hours: 18 },
    { name: "Others", value: 5, color: "#EF4444", hours: 7 },
  ]

  const learningPatterns = [
    { hour: "6 AM", sessions: 2 },
    { hour: "8 AM", sessions: 5 },
    { hour: "10 AM", sessions: 8 },
    { hour: "12 PM", sessions: 12 },
    { hour: "2 PM", sessions: 15 },
    { hour: "4 PM", sessions: 18 },
    { hour: "6 PM", sessions: 25 },
    { hour: "8 PM", sessions: 30 },
    { hour: "10 PM", sessions: 20 },
  ]

  const exportData = () => {
    const data = {
      weeklyData,
      monthlyProgress,
      categoryData,
      learningPatterns,
      exportDate: new Date().toISOString(),
      timeRange,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `learnsync-analytics-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="ml-64 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              </div>
              <p className="text-gray-600">Detailed insights into your learning progress and patterns</p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>

              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-lg p-2">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">127</div>
                <div className="text-sm text-gray-600">Videos Completed</div>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">↑ 23% from last month</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div className="bg-blue-600 h-1 rounded-full" style={{ width: "78%" }} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 rounded-lg p-2">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">72h</div>
                <div className="text-sm text-gray-600">Total Watch Time</div>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">↑ 18% from last month</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div className="bg-purple-600 h-1 rounded-full" style={{ width: "65%" }} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 rounded-lg p-2">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">85%</div>
                <div className="text-sm text-gray-600">Weekly Goal</div>
              </div>
            </div>
            <div className="text-sm text-blue-600 font-medium">510/600 minutes</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div className="bg-green-600 h-1 rounded-full" style={{ width: "85%" }} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 rounded-lg p-2">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">6.2</div>
                <div className="text-sm text-gray-600">Avg. Daily Hours</div>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">↑ 12% from last week</div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
              <div className="bg-orange-600 h-1 rounded-full" style={{ width: "92%" }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Weekly Activity</h2>
              <div className="flex gap-2">
                {["videos", "minutes", "xp"].map((metric) => (
                  <button
                    key={metric}
                    onClick={() => setSelectedMetric(metric)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedMetric === metric ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {metric.charAt(0).toUpperCase() + metric.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey={selectedMetric}
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  className="hover:opacity-80 transition-opacity"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Learning Categories */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Learning Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                    <div className="text-xs text-gray-500">{item.hours}h</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Progress */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Monthly Progress Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="videos" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="hours" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Learning Patterns */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Daily Learning Patterns</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={learningPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p>Peak learning time: 8-10 PM • Most productive day: Saturday</p>
            </div>
          </div>
        </div>

        {/* Detailed Insights */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Learning Insights & Recommendations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <h3 className="font-semibold text-blue-900">Consistency Score</h3>
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
              <p className="text-sm text-blue-700">
                You're maintaining great consistency! Try to hit your daily goals 3 more days this week.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <h3 className="font-semibold text-green-900">Optimal Time</h3>
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">8-10 PM</div>
              <p className="text-sm text-green-700">
                Your peak learning hours. Consider scheduling challenging topics during this time.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <h3 className="font-semibold text-purple-900">Focus Area</h3>
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">Web Dev</div>
              <p className="text-sm text-purple-700">
                35% of your time. Consider diversifying with complementary skills like design.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-gray-900 mb-2">🎯 This Week's Goal</h3>
            <p className="text-gray-700 mb-3">
              Complete 15 more videos to reach your weekly target and maintain your 12-day streak!
            </p>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-white rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  style={{ width: "73%" }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600">73% complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
