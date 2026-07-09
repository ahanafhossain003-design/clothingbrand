import fs from 'fs';
let code = fs.readFileSync('src/pages/storefront/ProductView.tsx', 'utf8');

// revert colors section
const searchStr1 = `                  ))}
                </div>
                {product.sizeChartImage && (
                  <div className="mt-6 border border-gray-100 dark:border-gray-800 rounded p-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Size Chart</h4>
                    <img src={product.sizeChartImage} alt="Size Chart" className="w-full h-auto object-contain" />
                  </div>
                )}
              </div>
            )}`;
const replaceStr1 = `                  ))}
                </div>
              </div>
            )}`;

code = code.replace(searchStr1, replaceStr1);

// add to sizes section
const searchStr2 = `                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}`;
const replaceStr2 = `                  ))}
                </div>
                {product.sizeChartImage && (
                  <div className="mt-6 border border-gray-100 dark:border-gray-800 rounded p-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Size Chart</h4>
                    <img src={product.sizeChartImage} alt="Size Chart" className="w-full h-auto object-contain" />
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}`;

code = code.replace(searchStr2, replaceStr2);

fs.writeFileSync('src/pages/storefront/ProductView.tsx', code);
