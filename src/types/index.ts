export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface Playlist {
  id: string;
  title: string;
  url: string;
  videoCount: number;
  completedVideos: number;
  videos: Video[];
}

export interface Folder {
  id: string;
  name: string;
  icon: string;
  color: string;
  playlists: Playlist[];
  userId: string;
  createdAt: Date;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  completed: boolean;
}

export interface UserStats {
  totalVideosCompleted: number;
  totalWatchTime: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}
