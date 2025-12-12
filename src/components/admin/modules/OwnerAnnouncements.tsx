/* copilot:follow
This module is MARKED AS DONE.
It is protected. Do NOT modify unless the user explicitly asks.
*/

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { announcementService, Announcement } from '@/services/api/announcementService';

const OwnerAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const initialFormState: Announcement = {
    text: '',
    icon: 'Flame',
    action: 'Learn More',
    link_target: 'services',
    sort_order: 0,
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    setLoading(true);
    const data = await announcementService.getAll();
    setAnnouncements(data);
    setLoading(false);
  };

  const handleAddNew = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id || null);
    setFormData(announcement);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await announcementService.delete(id);
      loadAnnouncements();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await announcementService.update(editingId, formData);
      } else {
        await announcementService.create(formData);
      }
      loadAnnouncements();
      setIsModalOpen(false);
      setFormData(initialFormState);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const icons = ['Flame', 'Sparkles', 'Clock', 'Gift', 'GraduationCap', 'Sun'];
  const targets = ['services', 'booking', 'discounts', 'membership'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Announcements</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage homepage announcement bar</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:opacity-90"
        >
          <Plus className="w-4 h-4" /> Add Announcement
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : announcements.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 p-12 rounded-2xl border border-gray-200 dark:border-neutral-700 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No announcements yet</p>
          <button onClick={handleAddNew} className="text-black dark:text-white font-medium hover:underline">
            Create your first announcement
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-gray-200 dark:border-neutral-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-neutral-700 border-b border-gray-200 dark:border-neutral-600">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((ann) => (
                  <tr key={ann.id} className="border-b border-gray-100 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white line-clamp-2">{ann.text}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{ann.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{ann.link_target}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${ann.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-neutral-700 dark:text-gray-400'}`}>
                        {ann.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(ann)}
                        className="p-2 bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(ann.id!)}
                        className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-700 p-6 flex justify-between items-center z-10">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingId ? 'Edit Announcement' : 'Create Announcement'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Message Text</label>
                <textarea
                  rows={3}
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  placeholder="Enter announcement message..."
                  className="w-full mt-2 bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white border border-gray-200 dark:border-neutral-600 focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full mt-2 bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white border border-gray-200 dark:border-neutral-600 focus:border-black dark:focus:border-white"
                >
                  {icons.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Action Text</label>
                  <input
                    type="text"
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    placeholder="e.g., Book Now"
                    className="w-full mt-2 bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white border border-gray-200 dark:border-neutral-600 focus:border-black dark:focus:border-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">Link Target</label>
                  <select
                    value={formData.link_target}
                    onChange={(e) => setFormData({ ...formData, link_target: e.target.value })}
                    className="w-full mt-2 bg-gray-50 dark:bg-neutral-700 p-3 rounded-lg text-sm outline-none dark:text-white border border-gray-200 dark:border-neutral-600 focus:border-black dark:focus:border-white"
                  >
                    {targets.map((target) => (
                      <option key={target} value={target}>{target}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 dark:bg-neutral-700 p-4 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded accent-black"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Active</label>
              </div>

              <button
                type="submit"
                className="w-full bg-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity mt-6"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerAnnouncements;
