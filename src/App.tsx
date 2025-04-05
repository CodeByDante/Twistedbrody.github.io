import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Video } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  hashtags: string[];
}

function App() {
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('videos');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedHashtag, setSelectedHashtag] = useState('');
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    url: '',
    category: '',
    newCategory: '',
    hashtags: '',
  });

  const categories = ['todos', ...new Set(videos.map(video => video.category))];
  const allHashtags = Array.from(new Set(videos.flatMap(video => video.hashtags || [])));

  useEffect(() => {
    localStorage.setItem('videos', JSON.stringify(videos));
  }, [videos]);

  const extractHashtags = (text: string): string[] => {
    const hashtagRegex = /#[\wáéíóúñÁÉÍÓÚÑ]+/g;
    return (text.match(hashtagRegex) || []).map(tag => tag.slice(1));
  };

  const getEmbedUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      
      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        const videoId = urlObj.hostname.includes('youtu.be') 
          ? urlObj.pathname.slice(1)
          : urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      
      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}`;
      }
      
      // Google Drive
      if (urlObj.hostname.includes('drive.google.com')) {
        const fileId = url.match(/[-\w]{25,}/);
        if (fileId) {
          return `https://drive.google.com/file/d/${fileId[0]}/preview`;
        }
      }
      
      return url;
    } catch (error) {
      console.error('Error al procesar la URL:', error);
      return url;
    }
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const category = newVideo.newCategory || newVideo.category;
    const hashtags = extractHashtags(newVideo.description + ' ' + newVideo.hashtags);
    
    const videoItem: VideoItem = {
      id: Date.now().toString(),
      title: newVideo.title,
      description: newVideo.description,
      url: getEmbedUrl(newVideo.url),
      category,
      hashtags,
    };
    
    setVideos([...videos, videoItem]);
    setNewVideo({ title: '', description: '', url: '', category: '', newCategory: '', hashtags: '' });
    setIsModalOpen(false);
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || video.category === selectedCategory;
    const matchesHashtag = !selectedHashtag || (video.hashtags && video.hashtags.includes(selectedHashtag));
    return matchesSearch && matchesCategory && matchesHashtag;
  });

  return (
    <div className="min-h-screen bg-[#121212] text-[#e0e0e0]">
      {/* Header */}
      <header className="bg-[#1e1e1e] py-6 px-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold text-[#bb86fc] flex items-center gap-2">
            <Video className="w-8 h-8" />
            TwistedBrody
          </h1>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a0a0a0]" />
            <input
              type="text"
              placeholder="Buscar videos..."
              className="w-full bg-[#1e1e1e] text-[#e0e0e0] pl-10 pr-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#bb86fc] focus:ring-1 focus:ring-[#bb86fc]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="bg-[#1e1e1e] text-[#e0e0e0] px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#bb86fc]"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          {allHashtags.length > 0 && (
            <select
              className="bg-[#1e1e1e] text-[#e0e0e0] px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#bb86fc]"
              value={selectedHashtag}
              onChange={(e) => setSelectedHashtag(e.target.value)}
            >
              <option value="">Todos los hashtags</option>
              {allHashtags.map(hashtag => (
                <option key={hashtag} value={hashtag}>#{hashtag}</option>
              ))}
            </select>
          )}
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map(video => (
            <div key={video.id} className="bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg transform transition-transform hover:scale-[1.02]">
              <div className="aspect-video">
                <iframe
                  src={video.url}
                  className="w-full h-full"
                  allowFullScreen
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                <p className="text-[#a0a0a0] mb-2">{video.description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block bg-[#bb86fc] text-[#121212] px-3 py-1 rounded-full text-sm">
                    {video.category}
                  </span>
                  {video.hashtags && Array.isArray(video.hashtags) && video.hashtags.map(hashtag => (
                    <span
                      key={hashtag}
                      className="inline-block bg-[#1e1e1e] text-[#bb86fc] border border-[#bb86fc] px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-[#bb86fc] hover:text-[#121212] transition-colors"
                      onClick={() => setSelectedHashtag(hashtag)}
                    >
                      #{hashtag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Video Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-[#bb86fc] hover:bg-[#9e5ffd] text-[#121212] p-4 rounded-full shadow-lg transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Add Video Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#1e1e1e] rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#bb86fc]">Agregar Nuevo Video</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#a0a0a0] hover:text-[#e0e0e0]">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddVideo}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-[#121212] text-[#e0e0e0] px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#bb86fc]"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción</label>
                  <textarea
                    required
                    className="w-full bg-[#121212] text-[#e0e0e0] px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#bb86fc]"
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">URL del Video</label>
                  <input
                    type="url"
                    required
                    className="w-full bg-[#121212] text-[#e0e0e0] px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#bb86fc]"
                    value={newVideo.url}
                    onChange={(e) => setNewVideo({...newVideo, url: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select
                    className="w-full bg-[#121212] text-[#e0e0e0] px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#bb86fc] mb-2"
                    value={newVideo.category}
                    onChange={(e) => setNewVideo({...newVideo, category: e.target.value})}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.filter(cat => cat !== 'todos').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="O agregar nueva categoría"
                    className="w-full bg-[#121212] text-[#e0e0e0] px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#bb86fc]"
                    value={newVideo.newCategory}
                    onChange={(e) => setNewVideo({...newVideo, newCategory: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Hashtags</label>
                  <input
                    type="text"
                    placeholder="Agregar hashtags (ej: #música #rock)"
                    className="w-full bg-[#121212] text-[#e0e0e0] px-4 py-2 rounded-lg border border-[#333] focus:outline-none focus:border-[#bb86fc]"
                    value={newVideo.hashtags}
                    onChange={(e) => setNewVideo({...newVideo, hashtags: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#bb86fc] hover:bg-[#9e5ffd] text-[#121212] py-2 rounded-lg font-medium transition-colors"
                >
                  Agregar Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;