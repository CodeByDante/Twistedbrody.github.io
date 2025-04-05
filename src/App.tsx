import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Github, X, Edit2, Trash2 } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  category: string;
  url: string;
  description?: string;
  tags?: string[];
}

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    url: '',
    description: '',
    tags: '',
    newCategory: ''
  });

  useEffect(() => {
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(videos.map(video => video.category)));
    setCategories(uniqueCategories);
  }, [videos]);

  const saveVideos = (newVideos: Video[]) => {
    localStorage.setItem('videos', JSON.stringify(newVideos));
    setVideos(newVideos);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const category = formData.newCategory || formData.category;
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.startsWith('#'));
    
    const videoData = {
      id: editingVideo?.id || Date.now().toString(),
      title: formData.title,
      category,
      url: formData.url,
      description: formData.description,
      tags
    };

    if (editingVideo) {
      const updatedVideos = videos.map(v => v.id === editingVideo.id ? videoData : v);
      saveVideos(updatedVideos);
    } else {
      saveVideos([...videos, videoData]);
    }

    setFormData({
      title: '',
      category: '',
      url: '',
      description: '',
      tags: '',
      newCategory: ''
    });
    setIsModalOpen(false);
    setEditingVideo(null);
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      category: video.category,
      url: video.url,
      description: video.description || '',
      tags: (video.tags || []).join(', '),
      newCategory: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (videoId: string) => {
    const updatedVideos = videos.filter(v => v.id !== videoId);
    saveVideos(updatedVideos);
  };

  const filteredVideos = videos
    .filter(video => 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedCategory || video.category === selectedCategory)
    )
    .sort(() => Math.random() - 0.5);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <header className="bg-[#1e1e1e] py-6 px-4 shadow-lg transition-all duration-300 ease-in-out">
        <h1 className="text-4xl font-bold text-center text-[#bb86fc] animate-fade-in">TwistedBrody</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8 animate-slide-in">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Buscar videos..."
              className="w-full pl-10 pr-4 py-2 bg-[#1e1e1e] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bb86fc] transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="bg-[#1e1e1e] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc] transition-all duration-200"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              Cargando videos...
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400 animate-fade-in">
              No se encontraron videos
            </div>
          ) : (
            filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className="video-card bg-[#1e1e1e] rounded-lg overflow-hidden shadow-lg"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-video">
                  <iframe
                    src={video.url}
                    className="absolute w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{video.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(video)}
                        className="text-[#bb86fc] hover:text-[#bb86fc]/80 transition-colors duration-200"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="text-red-500 hover:text-red-400 transition-colors duration-200"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{video.category}</p>
                  {video.description && (
                    <p className="text-sm text-gray-300 mb-2">{video.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {video.tags?.map(tag => (
                      <span
                        key={tag}
                        className="text-sm text-[#bb86fc] hover:text-[#bb86fc]/80 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 bg-[#bb86fc] text-black p-4 rounded-full shadow-lg hover:bg-[#bb86fc]/80 transition-all duration-300 hover:scale-110 hover:shadow-xl"
        >
          <PlusCircle size={24} />
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 modal-overlay">
            <div className="bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md modal-content">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingVideo ? 'Editar Video' : 'Agregar Video'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingVideo(null);
                    setFormData({
                      title: '',
                      category: '',
                      url: '',
                      description: '',
                      tags: '',
                      newCategory: ''
                    });
                  }}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-[#121212] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc] transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-[#121212] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc] transition-all duration-200 mb-2"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="O ingresa una nueva categoría"
                    value={formData.newCategory}
                    onChange={(e) => setFormData({...formData, newCategory: e.target.value})}
                    className="w-full bg-[#121212] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc] transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">URL del video</label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) => setFormData({...formData, url: e.target.value})}
                    className="w-full bg-[#121212] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc] transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción (opcional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-[#121212] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc] transition-all duration-200"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags (separados por comas, deben comenzar con #)</label>
                  <input
                    type="text"
                    placeholder="#ejemplo, #video"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    className="w-full bg-[#121212] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#bb86fc] transition-all duration-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#bb86fc] text-black py-2 rounded-lg font-medium hover:bg-[#bb86fc]/80 transition-all duration-300 hover:scale-105"
                >
                  {editingVideo ? 'Guardar Cambios' : 'Agregar Video'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-[#1e1e1e] py-6 px-4 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">
            Creado con ❤️ por{' '}
            <a
              href="https://github.com/CodeByDante/Twistedbrody.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#bb86fc] hover:text-[#bb86fc]/80 transition-colors duration-200 inline-flex items-center gap-1"
            >
              CodeByDante <Github size={16} />
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;