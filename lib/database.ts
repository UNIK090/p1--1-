import { supabase } from "./supabase"
import type { Database } from "./database.types"

type Tables = Database["public"]["Tables"]
type Folder = Tables["folders"]["Row"]
type Playlist = Tables["playlists"]["Row"]
type Video = Tables["videos"]["Row"]
type UserProgress = Tables["user_progress"]["Row"]
type Profile = Tables["profiles"]["Row"]

// Folder operations
export async function getFolders(userId: string) {
  const { data, error } = await supabase
    .from("folders")
    .select(`
      *,
      playlists (
        *,
        videos (
          id,
          user_progress (
            completed
          )
        )
      )
    `)
    .eq("user_id", userId)
    .order("position")

  if (error) throw error

  // Calculate completion stats for each folder
  return data.map((folder) => ({
    ...folder,
    playlists: folder.playlists.map((playlist) => ({
      ...playlist,
      completedVideos: playlist.videos.filter((video) => video.user_progress.some((progress) => progress.completed))
        .length,
    })),
  }))
}

export async function createFolder(
  userId: string,
  folderData: {
    name: string
    icon: string
    color: string
    description?: string
  },
) {
  const { data, error } = await supabase
    .from("folders")
    .insert({
      user_id: userId,
      ...folderData,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateFolder(folderId: string, updates: Partial<Folder>) {
  const { data, error } = await supabase.from("folders").update(updates).eq("id", folderId).select().single()

  if (error) throw error
  return data
}

export async function deleteFolder(folderId: string) {
  const { error } = await supabase.from("folders").delete().eq("id", folderId)

  if (error) throw error
}

// Playlist operations
export async function getPlaylist(playlistId: string, userId: string) {
  const { data, error } = await supabase
    .from("playlists")
    .select(`
      *,
      videos (
        *,
        user_progress!inner (
          completed,
          watch_time,
          completed_at
        )
      ),
      folders!inner (
        user_id
      )
    `)
    .eq("id", playlistId)
    .eq("folders.user_id", userId)
    .single()

  if (error) throw error

  // Calculate completion stats
  const completedVideos = data.videos.filter((video) =>
    video.user_progress.some((progress) => progress.completed),
  ).length

  return {
    ...data,
    completedVideos,
    videos: data.videos.map((video) => ({
      ...video,
      completed: video.user_progress.some((progress) => progress.completed),
    })),
  }
}

export async function createPlaylist(
  folderId: string,
  playlistData: {
    youtube_id: string
    title: string
    description?: string
    thumbnail_url?: string
    channel_title?: string
    channel_id?: string
    video_count: number
    total_duration: number
    url: string
  },
) {
  const { data, error } = await supabase
    .from("playlists")
    .insert({
      folder_id: folderId,
      ...playlistData,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePlaylist(playlistId: string) {
  const { error } = await supabase.from("playlists").delete().eq("id", playlistId)

  if (error) throw error
}

// Video operations
export async function createVideos(
  playlistId: string,
  videos: Array<{
    youtube_id: string
    title: string
    description?: string
    thumbnail_url?: string
    duration: number
    url: string
    position: number
  }>,
) {
  const { data, error } = await supabase
    .from("videos")
    .insert(
      videos.map((video) => ({
        playlist_id: playlistId,
        ...video,
      })),
    )
    .select()

  if (error) throw error
  return data
}

export async function toggleVideoCompletion(videoId: string, userId: string) {
  // First, check if progress exists
  const { data: existingProgress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("video_id", videoId)
    .eq("user_id", userId)
    .single()

  if (existingProgress) {
    // Update existing progress
    const { data, error } = await supabase
      .from("user_progress")
      .update({
        completed: !existingProgress.completed,
        completed_at: !existingProgress.completed ? new Date().toISOString() : null,
      })
      .eq("video_id", videoId)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Create new progress
    const { data, error } = await supabase
      .from("user_progress")
      .insert({
        user_id: userId,
        video_id: videoId,
        completed: true,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

// User profile operations
export async function getProfile(userId: string) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  if (error) throw error
  return data
}

// Learning session operations
export async function updateLearningSession(
  userId: string,
  date: string,
  updates: {
    videos_completed?: number
    watch_time?: number
    xp_earned?: number
  },
) {
  const { data, error } = await supabase
    .from("learning_sessions")
    .upsert({
      user_id: userId,
      date,
      ...updates,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getLearningHistory(userId: string, days = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from("learning_sessions")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true })

  if (error) throw error
  return data
}

// Analytics operations
export async function getUserStats(userId: string) {
  // Get total completed videos
  const { count: totalVideosCompleted } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("completed", true)

  // Get profile with streak and other stats
  const profile = await getProfile(userId)

  // Get this week's progress
  const startOfWeek = new Date()
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

  const { data: weeklyProgress } = await supabase
    .from("learning_sessions")
    .select("watch_time")
    .eq("user_id", userId)
    .gte("date", startOfWeek.toISOString().split("T")[0])

  const weeklyWatchTime = weeklyProgress?.reduce((sum, session) => sum + session.watch_time, 0) || 0

  return {
    totalVideosCompleted: totalVideosCompleted || 0,
    totalWatchTime: profile.total_watch_time,
    currentStreak: profile.current_streak,
    longestStreak: profile.longest_streak,
    weeklyGoal: profile.weekly_goal,
    weeklyProgress: Math.floor(weeklyWatchTime / 60), // Convert to minutes
    xpPoints: profile.xp_points,
    level: profile.level,
  }
}

// Notification operations
export async function createNotification(
  userId: string,
  notification: {
    title: string
    message: string
    type: string
    data?: any
  },
) {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      user_id: userId,
      ...notification,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getNotifications(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

  if (error) throw error
}

// Achievement operations
export async function checkAndAwardAchievements(userId: string) {
  const stats = await getUserStats(userId)
  const { data: achievements } = await supabase.from("achievements").select("*")
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("achievement_id")
    .eq("user_id", userId)

  const earnedAchievementIds = userAchievements?.map((ua) => ua.achievement_id) || []
  const newAchievements = []

  for (const achievement of achievements || []) {
    if (earnedAchievementIds.includes(achievement.id)) continue

    let earned = false
    switch (achievement.type) {
      case "videos":
        earned = stats.totalVideosCompleted >= (achievement.requirement || 0)
        break
      case "streak":
        earned = stats.currentStreak >= (achievement.requirement || 0)
        break
      case "time":
        earned = stats.totalWatchTime >= (achievement.requirement || 0)
        break
    }

    if (earned) {
      await supabase.from("user_achievements").insert({
        user_id: userId,
        achievement_id: achievement.id,
      })

      // Update user XP
      await supabase
        .from("profiles")
        .update({
          xp_points: stats.xpPoints + achievement.xp_reward,
          level: Math.floor((stats.xpPoints + achievement.xp_reward) / 1000) + 1,
        })
        .eq("id", userId)

      newAchievements.push(achievement)

      // Create notification
      await createNotification(userId, {
        title: "Achievement Unlocked!",
        message: `You've earned the "${achievement.name}" achievement!`,
        type: "achievement",
        data: { achievement },
      })
    }
  }

  return newAchievements
}

// Friend operations
export async function sendFriendRequest(userId: string, friendEmail: string) {
  // Find friend by email
  const { data: friend } = await supabase.from("profiles").select("id").eq("email", friendEmail).single()

  if (!friend) throw new Error("User not found")

  const { data, error } = await supabase
    .from("friends")
    .insert({
      user_id: userId,
      friend_id: friend.id,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error

  // Create notification for friend
  await createNotification(friend.id, {
    title: "New Friend Request",
    message: "You have a new friend request!",
    type: "social",
    data: { userId },
  })

  return data
}

export async function acceptFriendRequest(userId: string, friendId: string) {
  const { error } = await supabase
    .from("friends")
    .update({ status: "accepted" })
    .eq("user_id", friendId)
    .eq("friend_id", userId)

  if (error) throw error

  // Create reciprocal friendship
  await supabase.from("friends").insert({
    user_id: userId,
    friend_id: friendId,
    status: "accepted",
  })
}

export async function getFriends(userId: string) {
  const { data, error } = await supabase
    .from("friends")
    .select(`
      *,
      profiles!friends_friend_id_fkey (
        id,
        display_name,
        avatar_url,
        current_streak,
        level,
        xp_points
      )
    `)
    .eq("user_id", userId)
    .eq("status", "accepted")

  if (error) throw error
  return data
}

// Push notification operations
export async function savePushSubscription(
  userId: string,
  subscription: {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
  },
) {
  const { data, error } = await supabase
    .from("push_subscriptions")
    .upsert({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getPushSubscriptions(userId: string) {
  const { data, error } = await supabase.from("push_subscriptions").select("*").eq("user_id", userId)

  if (error) throw error
  return data
}
