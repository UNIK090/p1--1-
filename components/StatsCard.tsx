"use client"

import { type ReactNode, useState } from "react"
import { TrendingUp, TrendingDown } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  icon: ReactNode
  color: "blue" | "green" | "orange" | "purple"
  trend?: string
  interactive?: boolean
  progress?: number
}

export function StatsCard({ title, value, icon, color, trend, interactive = false, progress }: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const colorClasses = {
    blue: "bg-blue-50 border-blue-100 hover:border-blue-200",
    green: "bg-green-50 border-green-100 hover:border-green-200",
    orange: "bg-orange-50 border-orange-100 hover:border-orange-200",
    purple: "bg-purple-50 border-purple-100 hover:border-purple-200",
  }

  const trendColorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  }

  const progressColorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    orange: "bg-orange-600",
    purple: "bg-purple-600",
  }

  const isPositiveTrend = trend?.includes("+") || trend?.includes("↑")

  return (
    <div
      className={`${colorClasses[color]} rounded-xl border p-6 transition-all duration-200 ${
        interactive ? "cursor-pointer hover:shadow-lg transform hover:-translate-y-1" : "hover:shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-600 text-sm font-medium">{title}</div>
        <div className={`transition-transform duration-200 ${isHovered ? "scale-110" : ""}`}>{icon}</div>
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-2">{value}</div>

      {trend && (
        <div
          className={`text-sm font-medium flex items-center gap-1 ${
            isPositiveTrend ? "text-green-600" : "text-gray-600"
          }`}
        >
          {isPositiveTrend && <TrendingUp className="h-3 w-3" />}
          {trend.includes("↓") && <TrendingDown className="h-3 w-3" />}
          <span>{trend}</span>
        </div>
      )}

      {progress !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`${progressColorClasses[color]} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{Math.round(progress)}% of goal</div>
        </div>
      )}

      {interactive && isHovered && <div className="mt-3 text-xs text-gray-500">Click for details →</div>}
    </div>
  )
}

export default StatsCard
