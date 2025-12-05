import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Trash2, Eye, FolderOpen, Grid, List, Search, Filter, X } from 'lucide-react';

interface MediaItem {
  id: number;
  url: string;
  name: string;
  type: 'service' | 'banner' | 'gallery' | 'staff' | 'product';
  size: string;
  uploadedAt: string;
  usedIn?: string[];
}

export default function AdminMedia() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load media items from localStorage on mount
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('media_library');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever mediaItems changes
  useEffect(() => {
    localStorage.setItem('media_library', JSON.stringify(mediaItems));
  }, [mediaItems]);

  const categories = [
    { id: 'all', label: 'All Media', icon: ImageIcon },
    { id: 'service', label: 'Services', icon: FolderOpen },
    { id: 'banner', label: 'Banners', icon: ImageIcon },
    { id: 'gallery', label: 'Gallery', icon: Grid },
    { id: 'staff', label: 'Staff', icon: ImageIcon },
    { id: 'product', label: 'Products', icon: ImageIcon }
  ];

  const filteredMedia = mediaItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newItem: MediaItem = {
          id: Date.now() + Math.random(),
          url: reader.result as string,
          name: file.name,
          type: selectedCategory === 'all' ? 'gallery' : selectedCategory as MediaItem['type'],
          size: `${(file.size / 1024).toFixed(0)} KB`,
          uploadedAt: new Date().toISOString().split('T')[0],
          usedIn: []
        };
        setMediaItems(prev => [newItem, ...prev]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (ids: number[]) => {
    if (confirm(`Delete ${ids.length} image(s)?`)) {
      setMediaItems(prev => prev.filter(item => !ids.includes(item.id)));
      setSelectedImages([]);
    }
  };

  const toggleSelection = (id: number) => {
    setSelectedImages(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage photos, banners, and images for your website
          </p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-md"
        >
          <Upload className="w-4 h-4" />
          Upload Images
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{mediaItems.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Files</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {mediaItems.filter(i => i.type === 'service').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Service Images</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {mediaItems.filter(i => i.type === 'banner').length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Banners</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {(mediaItems.reduce((acc, item) => acc + parseInt(item.size), 0) / 1024).toFixed(1)} MB
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Size</div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & View */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm w-48 focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded ${view === 'grid' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${view === 'list' ? 'bg-white dark:bg-gray-800 shadow-sm' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedImages.length > 0 && (
          <div className="mt-4 flex items-center gap-3 p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {selectedImages.length} selected
            </span>
            <button
              onClick={() => handleDelete(selectedImages)}
              className="ml-auto px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedImages([])}
              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Media Grid/List */}
      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredMedia.map(item => (
            <div
              key={item.id}
              className={`group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                selectedImages.includes(item.id)
                  ? 'border-pink-500 ring-2 ring-pink-200 dark:ring-pink-800'
                  : 'border-gray-200 dark:border-gray-700 hover:border-pink-300'
              }`}
              onClick={() => toggleSelection(item.id)}
            >
              <div className="aspect-square relative">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewImage(item);
                    }}
                    className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-900" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete([item.id]);
                    }}
                    className="p-2 bg-red-500/90 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.name}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{item.size}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    item.type === 'service' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                    item.type === 'banner' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  <input
                    type="checkbox"
                    checked={selectedImages.length === filteredMedia.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedImages(filteredMedia.map(i => i.id));
                      } else {
                        setSelectedImages([]);
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Preview</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Uploaded</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Used In</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMedia.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(item.id)}
                      onChange={() => toggleSelection(item.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <img src={item.url} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.type === 'service' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                      item.type === 'banner' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.size}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.uploadedAt}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                    {item.usedIn && item.usedIn.length > 0 ? item.usedIn.join(', ') : 'Not used'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setPreviewImage(item)}
                        className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete([item.id])}
                        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImage(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{previewImage.name}</h3>
              <button onClick={() => setPreviewImage(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <img src={previewImage.url} alt={previewImage.name} className="w-full rounded-lg" />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Type:</span>
                  <span className="ml-2 text-gray-900 dark:text-white capitalize">{previewImage.type}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Size:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{previewImage.size}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Uploaded:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{previewImage.uploadedAt}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Used In:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {previewImage.usedIn && previewImage.usedIn.length > 0 ? previewImage.usedIn.join(', ') : 'Not used'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredMedia.length === 0 && (
        <div className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No images found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery ? 'Try a different search term' : 'Upload your first image to get started'}
          </p>
          {!searchQuery && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload Images
            </button>
          )}
        </div>
      )}
    </div>
  );
}
