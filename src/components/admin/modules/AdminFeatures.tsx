import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff, GripVertical, X, Check } from 'lucide-react';
import { featureService, type Feature } from '@/services/api/featureService';

const AdminFeatures: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Feature>({
    name: '',
    description: '',
    icon: '',
    category: 'general',
    is_active: true,
    sort_order: 0
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    loadFeatures();
  }, [selectedCategory]);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const data = await featureService.getFeatures(selectedCategory || undefined);
      setFeatures(data);
    } catch (error) {
      console.error('Failed to load features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await featureService.updateFeature(editingId, formData);
      } else {
        await featureService.createFeature(formData);
      }
      loadFeatures();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save feature:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;

    try {
      await featureService.deleteFeature(id);
      loadFeatures();
    } catch (error) {
      console.error('Failed to delete feature:', error);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      await featureService.bulkUpdateStatus([id], !currentStatus);
      loadFeatures();
    } catch (error) {
      console.error('Failed to toggle status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      category: 'general',
      is_active: true,
      sort_order: 0
    });
    setEditingId(null);
  };

  const handleEdit = (feature: Feature) => {
    setFormData(feature);
    setEditingId(feature.id || null);
    setIsModalOpen(true);
  };

  const categories = [
    'general',
    'why_choose_us',
    'benefits',
    'services',
    'trust_badges'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Features</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create and manage features displayed across the website
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-lg font-bold text-sm hover:bg-yellow-500 transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Feature
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            selectedCategory === ''
              ? 'bg-yellow-400 text-black'
              : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-yellow-100'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors capitalize ${
              selectedCategory === cat
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-yellow-100'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Features List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full border-4 border-yellow-400 border-t-gray-300 animate-spin"></div>
        </div>
      ) : features.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-neutral-700">
          <p className="text-gray-600 dark:text-gray-400">No features found. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-gray-200 dark:border-neutral-700 flex items-center justify-between hover:border-yellow-400 dark:hover:border-yellow-400 transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <GripVertical className="w-5 h-5 text-gray-400 cursor-grab active:cursor-grabbing" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white truncate">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {feature.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 capitalize">
                      {feature.category || 'general'}
                    </span>
                    <span className="text-gray-500">Order: {feature.sort_order}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4 shrink-0">
                <button
                  onClick={() => handleToggleStatus(feature.id!, feature.is_active)}
                  className={`p-2 rounded-lg transition-colors ${
                    feature.is_active
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400'
                  }`}
                  title={feature.is_active ? 'Hide' : 'Show'}
                >
                  {feature.is_active ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => handleEdit(feature)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(feature.id!)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 max-w-md w-full mx-4 border border-gray-200 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Feature' : 'New Feature'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="p-2 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Feature Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg text-sm outline-none border border-gray-200 dark:border-neutral-700 focus:border-yellow-400 dark:text-white"
                  placeholder="e.g., Premium Quality"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg text-sm outline-none border border-gray-200 dark:border-neutral-700 focus:border-yellow-400 dark:text-white resize-none"
                  placeholder="Feature description..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                    Category
                  </label>
                  <select
                    value={formData.category || 'general'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg text-sm outline-none border border-gray-200 dark:border-neutral-700 focus:border-yellow-400 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                    className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg text-sm outline-none border border-gray-200 dark:border-neutral-700 focus:border-yellow-400 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase">
                  Icon Name
                </label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-neutral-800 p-3 rounded-lg text-sm outline-none border border-gray-200 dark:border-neutral-700 focus:border-yellow-400 dark:text-white"
                  placeholder="e.g., CheckCircle"
                />
                <p className="text-xs text-gray-500 mt-1">Icon name from lucide-react library</p>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    Active
                  </span>
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-lg bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeatures;
