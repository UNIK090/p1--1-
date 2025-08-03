import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Plus, ArrowLeft, Trash } from 'lucide-react';
import AddPlaylistModal from './AddPlaylistModal';
import PlaylistCard from './PlaylistCard';

const FolderPage = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchFolder = async () => {
      if (folderId) {
        const folderDoc = await getDoc(doc(db, 'folders', folderId));
        if (folderDoc.exists()) {
          setFolder({ id: folderDoc.id, ...folderDoc.data() });
        } else {
          navigate('/dashboard');
        }
      }
    };
    fetchFolder();
  }, [folderId, navigate]);

  const handleAddPlaylist = async (playlist) => {
    if (folder) {
      const newPlaylist = { ...playlist, id: Date.now().toString() };
      const updatedPlaylists = [...folder.playlists, newPlaylist];
      await updateDoc(doc(db, 'folders', folder.id), { playlists: updatedPlaylists });
      setFolder({ ...folder, playlists: updatedPlaylists });
      setShowAddModal(false);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (folder) {
      const updatedPlaylists = folder.playlists.filter(p => p.id !== playlistId);
      await updateDoc(doc(db, 'folders', folder.id), { playlists: updatedPlaylists });
      setFolder({ ...folder, playlists: updatedPlaylists });
    }
  };

  const handleDeleteFolder = async () => {
    if (folder) {
      await deleteDoc(doc(db, 'folders', folder.id));
      navigate('/dashboard');
    }
  };

  if (!folder) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/dashboard')} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <button onClick={handleDeleteFolder} className="flex items-center text-red-600 hover:text-red-800">
            <Trash className="h-5 w-5 mr-2" />
            Delete Folder
          </button>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{folder.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {folder.playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onDelete={() => handleDeletePlaylist(playlist.id)}
              onClick={() => navigate(`/playlist/${playlist.id}`)}
            />
          ))}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Playlist
        </button>

        {showAddModal && (
          <AddPlaylistModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddPlaylist}
          />
        )}
      </div>
    </div>
  );
};

FolderPage.propTypes = {
  folder: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    playlists: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })).isRequired,
  }),
};

export default FolderPage;
