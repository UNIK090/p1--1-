import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Folder, UserStats } from '../../types';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import StatsCard from './StatsCard';
import FolderCard from './FolderCard';
import AddFolderModal from './AddFolderModal';
import { Plus, Search, Flame, BookOpen, Clock, Trophy } from 'lucide-react';
import YouTubeSearch from './YouTubeSearch';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showYouTubeSearch, setShowYouTubeSearch] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      if (user) {
        const q = query(collection(db, 'folders'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedFolders: Folder[] = [];
        querySnapshot.forEach((doc) => {
          fetchedFolders.push({ id: doc.id, ...doc.data() } as Folder);
        });
        setFolders(fetchedFolders);
      }
    };
    fetchFolders();
  }, [user]);

  const stats: UserStats = {
    totalVideosCompleted: 127,
    totalWatchTime: 4320, // in minutes
    currentStreak: 12,
    longestStreak: 23,
    weeklyGoal: 600, // in minutes
    weeklyProgress: 420
  };

  const handleAddFolder = (folder: Omit<Folder, 'id' | 'userId' | 'createdAt'>) => {
    const newFolder: Folder = {
      ...folder,
      id: Date.now().toString(),
      userId: 'demo',
      createdAt: new Date()
    };
    setFolders([...folders, newFolder]);
    setShowAddModal(false);
  };

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowYouTubeSearch(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Track your learning progress and build consistent habits</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Current Streak"
            value={`${stats.currentStreak} days`}
            icon={<Flame className="h-6 w-6 text-orange-500" />}
            color="orange"
            trend="+2 from yesterday"
          />
          <StatsCard
            title="Videos Completed"
            value={stats.totalVideosCompleted.toString()}
            icon={<BookOpen className="h-6 w-6 text-blue-500" />}
            color="blue"
            trend="+5 this week"
          />
          <StatsCard
            title="Watch Time"
            value={`${Math.floor(stats.totalWatchTime / 60)}h ${stats.totalWatchTime % 60}m`}
            icon={<Clock className="h-6 w-6 text-green-500" />}
            color="green"
            trend="7h this week"
          />
          <StatsCard
            title="Longest Streak"
            value={`${stats.longestStreak} days`}
            icon={<Trophy className="h-6 w-6 text-purple-500" />}
            color="purple"
            trend="Personal best!"
          />
        </div>

        {/* Search and Add */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search YouTube resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
            >
              Search
            </button>
          </form>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-5 w-5" />
            Add Folder
          </button>
        </div>

        {/* YouTube Search Results */}
        {showYouTubeSearch && (
          <YouTubeSearch query={searchQuery} onClose={() => setShowYouTubeSearch(false)} />
        )}

        {/* Folders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onClick={() => navigate(`/folder/${folder.id}`)}
            />
          ))}
        </div>

        {filteredFolders.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No folders found</h3>
            <p className="text-gray-500 mb-6">Create your first learning folder to get started</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Folder
            </button>
          </div>
        )}
      </div>

      {showAddModal && (
        <AddFolderModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddFolder}
        />
      )}
    </div>
  );
};

export default Dashboard;
