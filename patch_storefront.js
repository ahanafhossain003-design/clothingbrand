import fs from 'fs';
let code = fs.readFileSync('src/pages/storefront/ProductView.tsx', 'utf8');

const searchStr = `                  ))}
                </div>
              </div>
            )}`;

const replaceStr = `                  ))}
                </div>
                {product.sizeChartImage && (
                  <div className="mt-6 border border-gray-100 dark:border-gray-800 rounded p-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Size Chart</h4>
                    <img src={product.sizeChartImage} alt="Size Chart" className="w-full h-auto object-contain" />
                  </div>
                )}
              </div>
            )}`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/pages/storefront/ProductView.tsx', code);
