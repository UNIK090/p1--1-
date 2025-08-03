import { signInWithPopup, signInWithRedirect, signOut, type User } from "firebase/auth"
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { auth, googleProvider, db } from "./firebase"

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string
  createdAt: any
  lastLoginAt: any
  emailNotifications: boolean
  learningStreak: number
  totalVideosWatched: number
  totalTimeSpent: number
}

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    // Create or update user profile in Firestore
    await createOrUpdateUserProfile(user)

    return user
  } catch (error) {
    console.error("Error signing in with Google:", error)
    throw error
  }
}

export const signInWithGoogleRedirect = async (): Promise<void> => {
  try {
    await signInWithRedirect(auth, googleProvider)
  } catch (error) {
    console.error("Error signing in with Google redirect:", error)
    throw error
  }
}

export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Error signing out:", error)
    throw error
  }
}

export const createOrUpdateUserProfile = async (user: User): Promise<void> => {
  if (!user.email) return

  const userRef = doc(db, "users", user.uid)
  const userSnap = await getDoc(userRef)

  const userData: Partial<UserProfile> = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    lastLoginAt: serverTimestamp(),
  }

  if (!userSnap.exists()) {
    // New user
    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      emailNotifications: true,
      learningStreak: 0,
      totalVideosWatched: 0,
      totalTimeSpent: 0,
    })
  } else {
    // Existing user - update last login
    await setDoc(userRef, userData, { merge: true })
  }
}

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}
