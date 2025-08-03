import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Playlist } from '../../types';

interface AddPlaylistModalProps {
  onClose: () => void;
  onAdd: (playlist: Omit<Playlist, 'id'>) => void;
}

const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && url.trim()) {
      onAdd({
        title: title.trim(),
        url: url.trim(),
        videoCount: 0,
        completedVideos: 0,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Add New Playlist</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="playlistTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Playlist Title
            </label>
            <input
              type="text"
              id="playlistTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., React Fundamentals"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="playlistUrl" className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Playlist URL
            </label>
            <input
              type="url"
              id="playlistUrl"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/playlist?list=..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Add Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlaylistModal;
