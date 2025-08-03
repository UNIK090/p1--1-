"use client"

import { Clock, Play, CheckCircle, TrendingUp } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "completed",
      title: 'Completed "React Hooks Deep Dive"',
      subtitle: "Web Development",
      time: "2 hours ago",
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
    },
    {
      id: 2,
      type: "started",
      title: 'Started "Advanced JavaScript Patterns"',
      subtitle: "Web Development",
      time: "4 hours ago",
      icon: Play,
      color: "text-blue-600 bg-blue-100",
    },
    {
      id: 3,
      type: "milestone",
      title: "Reached 50% completion",
      subtitle: "Data Structures Course",
      time: "1 day ago",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-100",
    },
    {
      id: 4,
      type: "completed",
      title: 'Finished "CSS Grid Mastery"',
      subtitle: "Web Development",
      time: "2 days ago",
      icon: CheckCircle,
      color: "text-green-600 bg-green-100",
    },
  ]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activity.color}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {activity.subtitle} • {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
        View All Activity
      </button>
    </div>
  )
}

export default RecentActivity
