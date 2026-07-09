import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/AdminProducts.tsx', 'utf8');
const searchStr = `                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Colors (Comma separated)</label>`;
                  
const replaceStr = `                  </div>
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
                  <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Colors (Comma separated)</label>`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/pages/admin/AdminProducts.tsx', code);
