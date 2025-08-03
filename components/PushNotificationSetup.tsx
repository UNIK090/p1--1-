"use client"

import { useState, useEffect } from "react"
import { Bell, BellOff } from "lucide-react"
import { useSession } from "next-auth/react"

export default function PushNotificationSetup() {
  const { data: session } = useSession()
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true)
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      setIsSubscribed(!!subscription)
    } catch (error) {
      console.error("Error checking subscription:", error)
    }
  }

  const subscribeToPush = async () => {
    try {
      setLoading(true)

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      // Send subscription to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      })

      setIsSubscribed(true)
    } catch (error) {
      console.error("Error subscribing to push notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const unsubscribeFromPush = async () => {
    try {
      setLoading(true)

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        await subscription.unsubscribe()
        setIsSubscribed(false)
      }
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isSupported || !session) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isSubscribed
            ? "bg-green-100 text-green-700 hover:bg-green-200"
            : "bg-blue-100 text-blue-700 hover:bg-blue-200"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
        ) : isSubscribed ? (
          <BellOff className="h-4 w-4" />
        ) : (
          <Bell className="h-4 w-4" />
        )}
        {isSubscribed ? "Notifications On" : "Enable Notifications"}
      </button>
    </div>
  )
}
