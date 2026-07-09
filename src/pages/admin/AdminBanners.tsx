import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { Plus, Trash2, X, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import MediaRenderer from '../../components/MediaRenderer';
import { set as idbSet } from 'idb-keyval';

export default function AdminBanners() {
  const { banners, addBanner, deleteBanner, updateBannerOrder, bannerSlideshow, toggleBannerSlideshow } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ imageUrl: '', title: '', subtitle: '', link: '' });

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Please upload or provide an image URL');
      return;
    }

    addBanner({
      imageUrl: formData.imageUrl,
      title: formData.title,
      subtitle: formData.subtitle,
      link: formData.link,
      order: banners.length + 1
    });
    setFormData({ imageUrl: '', title: '', subtitle: '', link: '' });
    setIsModalOpen(false);
  };

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sortedBanners.length - 1)) return;
    
    const newBanners = [...sortedBanners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap orders
    const tempOrder = newBanners[index].order;
    newBanners[index].order = newBanners[targetIndex].order;
    newBanners[targetIndex].order = tempOrder;
    
    updateBannerOrder(newBanners);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage homepage slider banners.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center cursor-pointer">
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={bannerSlideshow} onChange={toggleBannerSlideshow} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${bannerSlideshow ? 'bg-gold-500' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${bannerSlideshow ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">Auto-Slideshow</span>
          </label>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gold-500 text-white px-4 py-2 text-sm font-medium hover:bg-gold-600 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" /> Add Banner
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {sortedBanners.map((banner, index) => (
          <div key={banner.id} className="bg-white dark:bg-black border border-gray-100 dark:border-gray-800 rounded-lg p-4 flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-64 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
              <MediaRenderer url={banner.imageUrl} className="w-full h-full object-cover" type="img" />
            </div>
            
            <div className="flex-1">
              <h3 className="font-serif text-xl font-bold">{banner.title || 'Untitled Banner'}</h3>
              <p className="text-sm text-gold-500 mt-1 uppercase tracking-widest">{banner.subtitle}</p>
              <p className="text-xs text-gray-500 mt-2">Link: {banner.link || 'None'}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => moveBanner(index, 'up')} 
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gold-500 disabled:opacity-30"
                >
                  <ArrowUp size={20} />
                </button>
                <button 
                  onClick={() => moveBanner(index, 'down')} 
                  disabled={index === sortedBanners.length - 1}
                  className="p-1 text-gray-400 hover:text-gold-500 disabled:opacity-30"
                >
                  <ArrowDown size={20} />
                </button>
              </div>
              <button 
                onClick={() => {
                  setDeletingId(banner.id);
                }} 
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-luxury-black w-full max-w-lg rounded-xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-serif font-bold">Add New Banner</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Banner Media *</label>
                <div className="flex flex-col space-y-3">
                  {formData.imageUrl && (
                    <div className="relative w-full h-32 border border-gray-200 dark:border-gray-700 rounded overflow-hidden flex justify-center bg-black/5">
                      <MediaRenderer url={formData.imageUrl} className="w-full h-full object-cover" type="img" />
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, imageUrl: ''})}
                        className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                  
                  {!formData.imageUrl && (
                    <label 
                      className={`w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded transition-colors bg-gray-50 dark:bg-black/50 text-gray-500 ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer hover:border-gold-500 hover:text-gold-500'}`}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files?.[0];
                        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
                          setIsUploading(true);
                          const fileId = `idb-media-${Date.now()}-${file.name}`;
                          idbSet(fileId, file).then(() => {
                            setFormData({...formData, imageUrl: fileId});
                            setIsUploading(false);
                          }).catch(() => {
                            alert('Error saving file. It might be too large or there might not be enough space.');
                            setIsUploading(false);
                          });
                        }
                      }}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={24} className="mb-2 animate-spin text-gold-500" />
                          <span className="text-xs font-medium uppercase">Processing File...</span>
                        </>
                      ) : (
                        <>
                          <Plus size={24} className="mb-2" />
                          <span className="text-xs font-medium uppercase">Upload Image or Video</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        disabled={isUploading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploading(true);
                            const fileId = `idb-media-${Date.now()}-${file.name}`;
                            idbSet(fileId, file).then(() => {
                              setFormData({...formData, imageUrl: fileId});
                              setIsUploading(false);
                            }).catch(() => {
                              alert('Error saving file. It might be too large or there might not be enough space.');
                              setIsUploading(false);
                            });
                          }
                        }} 
                        className="hidden" 
                      />
                    </label>
                  )}
                  
                  {!formData.imageUrl && (
                    <div>
                      <label className="block text-[10px] font-medium uppercase text-gray-500 mb-1">Or enter image/video URL</label>
                      <input type="text" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700 text-sm" placeholder="https://..." />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Subtitle</label>
                <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Link URL</label>
                <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" placeholder="/category/shirts" />
              </div>
              
              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-gold-500 text-white px-6 py-2 text-sm font-medium hover:bg-gold-600 transition-colors">Add Banner</button>
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
            <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this banner? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeletingId(null)} 
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteBanner(deletingId);
                  setDeletingId(null);
                }} 
                className="bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 rounded"
              >
                Delete Banner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
