"use client"

import type React from "react"

import { useState } from "react"
import { X, Sparkles } from "lucide-react"

interface AddFolderModalProps {
  onClose: () => void
  onAdd: (folder: any) => void
}

export function AddFolderModal({ onClose, onAdd }: AddFolderModalProps) {
  const [name, setName] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("📚")
  const [selectedColor, setSelectedColor] = useState("blue")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const icons = ["📚", "💻", "🧠", "🌍", "🎨", "🔬", "📊", "🏃‍♂️", "🎵", "🍳", "🚀", "⚡", "🎯", "🔥", "💡"]
  const colors = [
    { name: "blue", class: "bg-blue-500", label: "Ocean Blue" },
    { name: "green", class: "bg-green-500", label: "Forest Green" },
    { name: "purple", class: "bg-purple-500", label: "Royal Purple" },
    { name: "orange", class: "bg-orange-500", label: "Sunset Orange" },
    { name: "red", class: "bg-red-500", label: "Cherry Red" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setIsSubmitting(true)
      try {
        await onAdd({
          name: name.trim(),
          icon: selectedIcon,
          color: selectedColor,
        })
      } catch (error) {
        console.error("Error creating folder:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md transform transition-all duration-200 scale-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Create New Folder</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <input
              type="text"
              id="folderName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Data Structures & Algorithms"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Icon</label>
            <div className="grid grid-cols-5 gap-2">
              {icons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`p-3 rounded-xl border-2 text-2xl transition-all hover:scale-105 ${
                    selectedIcon === icon
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Color</label>
            <div className="space-y-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all hover:shadow-sm ${
                    selectedColor === color.name
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <div className={`w-6 h-6 rounded-full ${color.class}`} />
                  <span className="text-sm font-medium text-gray-700">{color.label}</span>
                  {selectedColor === color.name && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create Folder"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddFolderModal
