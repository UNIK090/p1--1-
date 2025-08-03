import React from 'react';
import { MoreVertical, Play, Clock } from 'lucide-react';
import { Folder } from '../../types';

interface FolderCardProps {
  folder: Folder;
}

const FolderCard: React.FC<FolderCardProps> = ({ folder }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    red: 'bg-red-50 border-red-200 text-red-800'
  };

  const totalVideos = folder.playlists.reduce((acc, playlist) => acc + playlist.videoCount, 0);
  const completedVideos = folder.playlists.reduce((acc, playlist) => acc + playlist.completedVideos, 0);
  const progressPercentage = totalVideos > 0 ? (completedVideos / totalVideos) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-2xl ${colorClasses[folder.color as keyof typeof colorClasses]}`}>
            {folder.icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {folder.name}
            </h3>
            <p className="text-sm text-gray-500">{folder.playlists.length} playlists</p>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all">
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Play className="h-4 w-4" />
          <span>{completedVideos}/{totalVideos} videos</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>2h 30m</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="w-full bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-700 py-2 px-4 rounded-lg font-medium transition-all duration-200">
          {folder.playlists.length > 0 ? 'Continue Learning' : 'Add Playlists'}
        </button>
      </div>
    </div>
  );
};

export default FolderCard;
