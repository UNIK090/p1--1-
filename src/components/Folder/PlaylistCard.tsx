import React from 'react';
import { Playlist } from '../../types';
import { Play, Trash } from 'lucide-react';

interface PlaylistCardProps {
  playlist: Playlist;
  onDelete: () => void;
  onClick: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onDelete, onClick }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {playlist.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Trash className="h-4 w-4 text-gray-400 hover:text-red-500" />
        </button>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Play className="h-4 w-4 mr-2" />
        <span>{playlist.videoCount} videos</span>
      </div>
    </div>
  );
};

export default PlaylistCard;
