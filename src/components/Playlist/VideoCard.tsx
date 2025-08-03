import React from 'react';
import { Video } from '../../types';
import { Check, Play } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onToggleComplete: (videoId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onToggleComplete }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded-lg" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
          <p className="text-sm text-gray-500">{video.duration}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          <Play className="h-5 w-5" />
        </a>
        <button
          onClick={() => onToggleComplete(video.id)}
          className={`p-2 rounded-full ${
            video.completed
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
        >
          <Check className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default VideoCard;
