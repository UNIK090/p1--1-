import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Playlist, Video } from '../../types';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Check } from 'lucide-react';
import VideoCard from './VideoCard';

const PlaylistPage: React.FC = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState<Playlist | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (playlistId) {
        const playlistDoc = await getDoc(doc(db, 'playlists', playlistId));
        if (playlistDoc.exists()) {
          setPlaylist({ id: playlistDoc.id, ...playlistDoc.data() } as Playlist);
        } else {
          navigate('/dashboard');
        }
      }
    };
    fetchPlaylist();
  }, [playlistId, navigate]);

  const handleToggleComplete = async (videoId: string) => {
    if (playlist) {
      const updatedVideos = playlist.videos.map(video =>
        video.id === videoId ? { ...video, completed: !video.completed } : video
      );
      const completedVideos = updatedVideos.filter(video => video.completed).length;
      await updateDoc(doc(db, 'playlists', playlist.id), {
        videos: updatedVideos,
        completedVideos,
      });
      setPlaylist({ ...playlist, videos: updatedVideos, completedVideos });
    }
  };

  if (!playlist) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{playlist.title}</h1>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Progress</h2>
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-gray-600">{playlist.completedVideos} / {playlist.videoCount} completed</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(playlist.completedVideos / playlist.videoCount) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          {playlist.videos.map((video: Video) => (
            <VideoCard
              key={video.id}
              video={video}
              onToggleComplete={handleToggleComplete}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistPage;
