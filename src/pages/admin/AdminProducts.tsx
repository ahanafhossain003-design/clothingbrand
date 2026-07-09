import React, { useState } from 'react';
import { useAppStore } from '../../store';
import { formatCurrency } from '../../lib/utils';
import { Plus, Edit2, Trash2, X, Upload, Pin } from 'lucide-react';
import { Product } from '../../types';

export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const initialFormState = {
    name: '',
    description: '',
    price: 0,
    discountPrice: 0,
    categoryId: categories[0]?.id || '',
    images: [''],
    sizes: 'S,M,L,XL',
    sizeChartImage: '',
    colors: 'Black,White',
    inventory: 10,
    featured: false
  };
  
  const [formData, setFormData] = useState<any>(initialFormState);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPrice: product.discountPrice || 0,
        categoryId: product.categoryId,
        images: product.images,
        sizes: product.sizes.join(','),
        sizeChartImage: product.sizeChartImage || '',
        colors: product.colors.join(','),
        inventory: product.inventory,
        featured: product.featured || false
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const currentImages = prev.images.filter(img => img !== '');
          return {
            ...prev,
            images: [...currentImages, reader.result as string]
          };
        });
      };
      reader.readAsDataURL(file);
    });
    
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };


  const handleSizeChartUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, sizeChartImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: formData.price === '' ? 0 : formData.price,
      inventory: formData.inventory === '' ? 0 : formData.inventory,
      discountPrice: (formData.discountPrice !== '' && formData.discountPrice > 0) ? formData.discountPrice : undefined,
      sizes: formData.sizes.split(',').map((s: string) => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map((s: string) => s.trim()).filter(Boolean),
      images: formData.images.filter(Boolean),
      sizeChartImage: formData.sizeChartImage
    };

    if (submitData.images.length === 0) {
      submitData.images = ['https://via.placeholder.com/400x500?text=No+Image'];
    }

    if (editingId) {
      updateProduct(editingId, submitData);
    } else {
      addProduct(submitData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your store's inventory and catalog.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-gold-500 text-white px-4 py-2 text-sm font-medium hover:bg-gold-600 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-luxury-gray">
              <tr>
                <th className="px-4 sm:px-6 py-3">Product</th>
                <th className="px-4 sm:px-6 py-3 hidden md:table-cell">Category</th>
                <th className="px-4 sm:px-6 py-3">Price</th>
                <th className="px-4 sm:px-6 py-3 hidden lg:table-cell">Inventory</th>
                <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-luxury-gray/50">
                  <td className="px-4 sm:px-6 py-4 flex items-center space-x-3">
                    <img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover rounded-sm border border-gray-200" />
                    <div>
                      <p className="font-medium text-sm max-w-[100px] sm:max-w-none truncate sm:whitespace-normal">{product.name}</p>
                      {product.featured && <span className="text-[10px] bg-gold-100 text-gold-700 px-1 rounded uppercase tracking-wider">Featured</span>}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden md:table-cell">{categories.find(c => c.id === product.categoryId)?.name || 'Unknown'}</td>
                  <td className="px-4 sm:px-6 py-4">
                    {product.discountPrice ? (
                      <div>
                        <span className="font-medium text-red-600 block sm:inline">{formatCurrency(product.discountPrice)}</span>
                        <span className="text-xs text-gray-400 line-through sm:ml-2">{formatCurrency(product.price)}</span>
                      </div>
                    ) : (
                      <span className="font-medium">{formatCurrency(product.price)}</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">{product.inventory} in stock</td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col sm:flex-row justify-end items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <button 
                        onClick={() => updateProduct(product.id, { featured: !product.featured })} 
                        className={`${product.featured ? 'text-gold-500 hover:text-gold-700' : 'text-gray-500 hover:text-gray-700'} flex items-center text-xs font-bold uppercase tracking-wider transition-colors`}
                        title={product.featured ? "Unpin Product" : "Pin Product"}
                      >
                        <Pin size={16} className={`sm:mr-1 ${product.featured ? 'fill-current' : ''}`} /> <span className="hidden sm:inline">{product.featured ? 'Unpin' : 'Pin'}</span>
                      </button>
                      <button onClick={() => handleOpenModal(product)} className="text-blue-500 hover:text-blue-700 flex items-center text-xs font-bold uppercase tracking-wider">
                        <Edit2 size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button onClick={() => {
                        setDeletingId(product.id);
                      }} className="text-red-500 hover:text-red-700 flex items-center text-xs font-bold uppercase tracking-wider">
                        <Trash2 size={16} className="sm:mr-1" /> <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-luxury-black w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/95 dark:bg-luxury-black/95 backdrop-blur z-10">
              <h2 className="text-xl font-serif font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Product Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Description</label>
                  <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Price ($)</label>
                  <input type="number" required min="0" step="0.01" value={formData.price === '' ? '' : formData.price} onChange={e => setFormData({...formData, price: e.target.value === '' ? '' : parseFloat(e.target.value)})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Discount Price (0 for none)</label>
                  <input type="number" min="0" step="0.01" value={formData.discountPrice === '' ? '' : formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: e.target.value === '' ? '' : parseFloat(e.target.value)})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Category</label>
                  <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700">
                    {categories.map(c => <option key={c.id} value={c.id} className="dark:bg-black">{c.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Inventory</label>
                  <input type="number" required min="0" value={formData.inventory === '' ? '' : formData.inventory} onChange={e => setFormData({...formData, inventory: e.target.value === '' ? '' : parseInt(e.target.value)})} className="w-full border px-3 py-2 bg-transparent dark:border-gray-700" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-2">Product Images</label>
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-wrap gap-4">
                      {formData.images.filter((img: string) => img !== '').map((img: string, index: number) => (
                        <div key={index} className="relative w-24 h-24 border border-gray-200 dark:border-gray-700 rounded overflow-hidden">
                          <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                          <button 
                             type="button" 
                             onClick={() => {
                              const newImages = formData.images.filter((i: string) => i !== '');
                              newImages.splice(index, 1);
                              setFormData({...formData, images: newImages});
                            }}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {formData.images.filter((img: string) => img !== '').length < 4 && (
                        <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded cursor-pointer hover:border-gold-500 hover:text-gold-500 transition-colors bg-gray-50 dark:bg-black/50 text-gray-500">
                          <Plus size={24} className="mb-1 text-gray-400" />
                          <span className="text-[10px] font-medium uppercase text-center mt-1">Add<br/>Image</span>
                          <input 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Sizes (Comma separated)</label>
                  <input type="text" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} placeholder="e.g. S, M, L, XL or 30, 32, 34, 36, 38, 40" className="w-full border px-3 py-2 bg-transparent dark:border-gray-700 mb-2" />
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button type="button" onClick={() => setFormData({...formData, sizes: 'S, M, L, XL, XXL'})} className="text-[10px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors">Clothing (S-XXL)</button>
                    <button type="button" onClick={() => setFormData({...formData, sizes: '28, 30, 32, 34, 36, 38, 40, 42'})} className="text-[10px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors">Pants (28-42)</button>
                    <button type="button" onClick={() => setFormData({...formData, sizes: '7, 8, 9, 10, 11, 12'})} className="text-[10px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors">Shoes (7-12)</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.sizes.split(',').map((s: string) => s.trim()).filter(Boolean).map((s: string, i: number) => (
                       <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-black text-white dark:bg-white dark:text-black">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Size Chart Image</label>
                  <div className="flex items-center space-x-4">
                    {formData.sizeChartImage && (
                      <div className="relative w-16 h-16 border rounded bg-gray-50 dark:bg-gray-800 overflow-hidden">
                        <img src={formData.sizeChartImage} alt="Size Chart" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => setFormData({...formData, sizeChartImage: ''})} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5 hover:bg-red-600">
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded cursor-pointer hover:border-gold-500 dark:hover:border-gold-500 transition-colors bg-gray-50 dark:bg-black/50">
                      <Upload size={16} className="text-gray-400" />
                      <span className="text-[8px] uppercase tracking-wider text-gray-500 mt-1">Upload</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleSizeChartUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Colors (Comma separated)</label>
                  <input type="text" value={formData.colors} onChange={e => setFormData({...formData, colors: e.target.value})} placeholder="e.g. Black, White, Gold, Red" className="w-full border px-3 py-2 bg-transparent dark:border-gray-700 mb-2" />
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button type="button" onClick={() => setFormData({...formData, colors: 'Black, White, Gray'})} className="text-[10px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors">Monochrome</button>
                    <button type="button" onClick={() => setFormData({...formData, colors: 'Red, Blue, Green, Yellow'})} className="text-[10px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors">Primary</button>
                    <button type="button" onClick={() => setFormData({...formData, colors: 'Gold, Silver, Bronze'})} className="text-[10px] bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors">Metallic</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.colors.split(',').map((s: string) => s.trim()).filter(Boolean).map((s: string, i: number) => (
                       <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-black text-white dark:bg-white dark:text-black">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="text-gold-500 focus:ring-gold-500" />
                    <span className="text-sm font-medium">Feature on Homepage</span>
                  </label>
                </div>
              </div>
              
              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                {editingId ? (
                  <button type="button" onClick={() => {
                    setDeletingId(editingId);
                    setIsModalOpen(false);
                  }} className="px-4 py-2 text-sm font-medium text-red-500 hover:text-red-700 mr-auto">
                    Delete
                  </button>
                ) : <div></div>}
                <div className="flex">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-500 mr-2">Cancel</button>
                  <button type="submit" className="bg-gold-500 text-white px-6 py-2 text-sm font-medium hover:bg-gold-600 transition-colors">Save Product</button>
                </div>
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
            <p className="text-gray-500 mb-6 text-sm">Are you sure you want to delete this product? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setDeletingId(null)} 
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteProduct(deletingId);
                  setDeletingId(null);
                }} 
                className="bg-red-500 text-white px-4 py-2 text-sm font-medium hover:bg-red-600 rounded"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
