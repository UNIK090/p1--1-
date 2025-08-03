"use client"

import { useState, useEffect } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { signInWithGoogle, signOutUser, getUserProfile, type UserProfile } from "@/lib/auth"

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setLoading(false)

      if (user) {
        try {
          const profile = await getUserProfile(user.uid)
          setUserProfile(profile)
        } catch (err) {
          console.error("Error fetching user profile:", err)
          setError("Failed to load user profile")
        }
      } else {
        setUserProfile(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    try {
      setError(null)
      setLoading(true)
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError(null)
      await signOutUser()
    } catch (err: any) {
      setError(err.message || "Failed to sign out")
    }
  }

  return {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
  }
}
