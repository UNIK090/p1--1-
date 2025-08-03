"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash, Settings, Share, Download } from "lucide-react"
import AddPlaylistModal from "@/components/AddPlaylistModal"
import PlaylistCard from "@/components/PlaylistCard"
import FolderSettings from "@/components/FolderSettings"

export default function FolderPage() {
  const params = useParams()
  const router = useRouter()
  const [folder, setFolder] = useState<any>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFolder()
  }, [params.id])

  const fetchFolder = async () => {
    try {
      const response = await fetch(`/api/folders/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setFolder(data)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching folder:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlaylist = async (playlistData: any) => {
    try {
      const response = await fetch(`/api/folders/${params.id}/playlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(playlistData),
      })

      if (response.ok) {
        const updatedFolder = await response.json()
        setFolder(updatedFolder)
        setShowAddModal(false)
      }
    } catch (error) {
      console.error("Error adding playlist:", error)
    }
  }

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      const response = await fetch(`/api/folders/${params.id}/playlists/${playlistId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const updatedFolder = await response.json()
        setFolder(updatedFolder)
      }
    } catch (error) {
      console.error("Error deleting playlist:", error)
    }
  }

  const handleDeleteFolder = async () => {
    if (confirm("Are you sure you want to delete this folder? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/folders/${params.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Error deleting folder:", error)
      }
    }
  }

  const handleShareFolder = async () => {
    const shareData = {
      title: `Check out my ${folder.name} learning progress!`,
      text: `I'm learning ${folder.name} on LearnSync. Join me!`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleExportProgress = () => {
    const data = {
      folder: folder.name,
      playlists: folder.playlists.map((p: any) => ({
        title: p.title,
        progress: `${p.completedVideos}/${p.videoCount}`,
        completionRate: `${Math.round((p.completedVideos / p.videoCount) * 100)}%`,
      })),
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${folder.name}-progress.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!folder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Folder not found</h2>
          <button onClick={() => router.push("/dashboard")} className="text-blue-600 hover:text-blue-800">
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const totalVideos = folder.playlists.reduce((acc: number, playlist: any) => acc + playlist.videoCount, 0)
  const completedVideos = folder.playlists.reduce((acc: number, playlist: any) => acc + playlist.completedVideos, 0)
  const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShareFolder}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share className="h-4 w-4" />
              Share
            </button>
            <button
              onClick={handleExportProgress}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleDeleteFolder}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        {/* Folder Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-16 h-16 rounded-xl bg-${folder.color}-100 border border-${folder.color}-200 text-${folder.color}-800 flex items-center justify-center text-3xl`}
            >
              {folder.icon}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{folder.name}</h1>
              <p className="text-gray-600">
                {folder.playlists.length} playlists • {totalVideos} total videos
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{completedVideos} completed</span>
              <span>{totalVideos - completedVideos} remaining</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{completedVideos}</div>
              <div className="text-sm text-blue-600">Videos Completed</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-green-600">Progress</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{folder.playlists.length}</div>
              <div className="text-sm text-purple-600">Playlists</div>
            </div>
          </div>
        </div>

        {/* Playlists */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Playlists</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            Add Playlist
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folder.playlists.map((playlist: any) => (
            <PlaylistCard key={playlist.id} playlist={playlist} onDelete={() => handleDeletePlaylist(playlist.id)} />
          ))}
        </div>

        {folder.playlists.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-6xl mb-4">{folder.icon}</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No playlists yet</h3>
            <p className="text-gray-500 mb-6">Add your first YouTube playlist to start learning</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Playlist
            </button>
          </div>
        )}
      </div>

      {showAddModal && <AddPlaylistModal onClose={() => setShowAddModal(false)} onAdd={handleAddPlaylist} />}

      {showSettings && (
        <FolderSettings
          folder={folder}
          onClose={() => setShowSettings(false)}
          onUpdate={(updatedFolder) => {
            setFolder(updatedFolder)
            setShowSettings(false)
          }}
        />
      )}
    </div>
  )
}
