import React, { useState, useEffect } from 'react';

interface YouTubeSearchProps {
  query: string;
  onClose: () => void;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

const YouTubeSearch: React.FC<YouTubeSearchProps> = ({ query, onClose }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`);
        const data = await response.json();

        const fetchedVideos = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
        }));

        setVideos(fetchedVideos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Search Results for "{query}"</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          Close
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-gray-50 rounded-lg p-4">
            <img src={video.thumbnail} alt={video.title} className="w-full rounded-lg mb-2" />
            <h3 className="font-semibold text-gray-800 mb-1">{video.title}</h3>
            <p className="text-sm text-gray-600">{video.channelTitle}</p>
            <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800"
            >
              Watch Video
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeSearch;
