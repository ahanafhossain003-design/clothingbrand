import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Plus, Trash2, X, Upload, Edit2, Pin } from 'lucide-react';
import { Category } from '../../types';

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', image: '', pinned: false });

  const sortedCategories = [...categories].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setFormData({
        name: category.name,
        slug: category.slug,
        image: category.image || '',
        pinned: category.pinned || false
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', slug: '', image: '', pinned: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const categoryData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      image: formData.image || undefined,
      pinned: formData.pinned
    };

    if (editingId) {
      updateCategory(editingId, categoryData);
    } else {
      addCategory(categoryData);
    }
    
    setFormData({ name: '', slug: '', image: '' });
    setEditingId(null);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-serif">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage product categories.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gold-500 text-white px-4 py-2 text-sm font-medium hover:bg-gold-600 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedCategories.map((cat) => (
          <div key={cat.id} className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg overflow-hidden group relative">
            <Link to={`/admin/categories/${cat.id}`} className="absolute inset-0 z-10"></Link>
            <div className="h-40 bg-gray-100 dark:bg-luxury-gray relative">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
              )}
              {cat.pinned && (
                <div className="absolute top-2 right-2 bg-gold-500 text-white p-1.5 rounded-full shadow-md z-10">
                  <Pin size={12} className="fill-current" />
                </div>
              )}
            </div>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <div>
                <h3 className="font-bold text-lg">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">/{cat.slug}</p>
              </div>
              <div className="flex items-center space-x-3 relative z-20 pointer-events-auto">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateCategory(cat.id, { pinned: !cat.pinned });
                  }} 
                  className={`${cat.pinned ? 'text-gold-500' : 'text-gray-400 hover:text-gold-500'} transition-colors flex items-center text-xs font-bold uppercase tracking-wider`}
                  title={cat.pinned ? "Unpin Category" : "Pin Category"}
                >
                  <Pin size={16} className={`sm:mr-1 ${cat.pinned ? "fill-current" : ""}`} /> <span className="hidden sm:inline">{cat.pinned ? 'Unpin' : 'Pin'}</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOpenModal(cat);
                  }} 
                  className="text-blue-500 hover:text-blue-700 transition-colors flex items-center text-xs font-bold uppercase tracking-wider"
                >
                  <Edit2 size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Edit</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeletingId(cat.id);
                  }} 
                  className="text-red-500 hover:text-red-700 transition-colors flex items-center text-xs font-bold uppercase tracking-wider"
                >
                  <Trash2 size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-luxury-black w-full max-w-md rounded-xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-serif font-bold">{editingId ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Category Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Slug (Optional)</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" placeholder="e.g. summer-collection" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Category Image (Optional)</label>
                <div className="flex flex-col space-y-3">
                  {formData.image && (
                    <div className="relative w-full h-32 border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, image: ''})}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  {!formData.image && (
                    <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded cursor-pointer hover:border-gold-500 hover:text-gold-500 transition-colors bg-gray-50 dark:bg-black/50 text-gray-500">
                      <Upload size={24} className="mb-2" />
                      <span className="text-xs font-medium uppercase">Upload Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({...formData, image: reader.result as string});
                            };
                            reader.readAsDataURL(file);
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>
                  )}
                  
                  <div>
                    <label className="block text-[10px] font-medium uppercase text-gray-500 mb-1">Or enter image URL</label>
                    <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700 text-sm" placeholder="https://..." />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="pinned" 
                  checked={formData.pinned} 
                  onChange={e => setFormData({...formData, pinned: e.target.checked})} 
                  className="accent-gold-500 w-4 h-4"
                />
                <label htmlFor="pinned" className="text-sm font-medium text-gray-700 dark:text-gray-300">Pin to Navigation (Show first)</label>
              </div>
              
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-gold-500 text-white px-6 py-2 text-sm font-medium hover:bg-gold-600 transition-colors">
                  {editingId ? 'Save Changes' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-luxury-black w-full max-w-md rounded-xl shadow-2xl p-6 border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold mb-2">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this category? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeletingId(null)} 
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteCategory(deletingId);
                  setDeletingId(null);
                }} 
                className="bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 rounded"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
