"use client"

import { Plus, Search, Zap, Target } from "lucide-react"

interface QuickActionsProps {
  onAddFolder: () => void
}

export function QuickActions({ onAddFolder }: QuickActionsProps) {
  const actions = [
    {
      icon: Plus,
      label: "Add Folder",
      description: "Create a new learning folder",
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: onAddFolder,
    },
    {
      icon: Search,
      label: "Find Playlists",
      description: "Search YouTube for courses",
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => {},
    },
    {
      icon: Target,
      label: "Set Goals",
      description: "Update learning targets",
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => {},
    },
    {
      icon: Zap,
      label: "Quick Start",
      description: "Resume last session",
      color: "bg-orange-500 hover:bg-orange-600",
      onClick: () => {},
    },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="group bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 text-left hover:-translate-y-1"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center transition-transform group-hover:scale-110`}
              >
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {action.label}
                </h3>
              </div>
            </div>
            <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
