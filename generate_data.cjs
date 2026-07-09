const fs = require('fs');

const categories = [
  { id: 'c1', name: 'Shirts', slug: 'shirts' },
  { id: 'c2', name: 'T-Shirts', slug: 't-shirts' },
  { id: 'c3', name: 'Pants', slug: 'pants' },
  { id: 'c4', name: 'Jeans', slug: 'jeans' },
  { id: 'c5', name: 'Jackets', slug: 'jackets' },
  { id: 'c6', name: 'Shoes', slug: 'shoes' },
  { id: 'c7', name: 'Watches', slug: 'watches' },
  { id: 'c8', name: 'Accessories', slug: 'accessories' },
];

const banners = [
  {
    id: 'b1',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    title: 'LUXURY COLLECTION',
    subtitle: 'Redefining Elegance for the Modern Era',
    order: 1,
  },
  {
    id: 'b2',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
    title: 'AUTUMN ESSENTIALS',
    subtitle: 'Embrace the Season in Style',
    order: 2,
  },
];

const categoryImages = {
  'Shirts': [
    'https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1588359348347-9bc6cabb79ed?q=80&w=1000&auto=format&fit=crop'
  ],
  'T-Shirts': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop'
  ],
  'Pants': [
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?q=80&w=1000&auto=format&fit=crop'
  ],
  'Jeans': [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop'
  ],
  'Jackets': [
    'https://images.unsplash.com/photo-1551028719-0125fd6b7d8d?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520975954732-57dd22299614?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=1000&auto=format&fit=crop'
  ],
  'Shoes': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop'
  ],
  'Watches': [
    'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=1000&auto=format&fit=crop'
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?q=80&w=1000&auto=format&fit=crop'
  ]
};

const prefixes = ["Classic", "Modern", "Vintage", "Premium", "Essential", "Luxury", "Signature", "Urban", "Casual", "Formal", "Elegant", "Minimalist", "Bold", "Chic", "Timeless"];
const materials = ["Cotton", "Silk", "Linen", "Wool", "Leather", "Denim", "Canvas", "Suede"];
const colors = ["Black", "White", "Navy", "Grey", "Beige", "Olive", "Brown", "Burgundy"];

const products = [];
let pid = 1;

for (const cat of categories) {
  for (let i = 0; i < 15; i++) {
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const price = Math.floor(Math.random() * 5000) + 1500; // BDT pricing, like 1500 to 6500
    const imagesList = categoryImages[cat.name];
    const image = imagesList[i % imagesList.length];
    
    products.push({
      id: `p${pid++}`,
      name: `${prefix} ${cat.name.slice(0, -1)}`,
      description: `A highly sought-after ${cat.name.toLowerCase()} for the modern wardrobe. Comfortable, stylish, and perfect for everyday wear.`,
      price: price,
      categoryId: cat.id,
      images: [image],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [color],
      inventory: Math.floor(Math.random() * 50) + 10,
      featured: i < 2
    });
  }
}

const dataFileContent = `import { Product, Category, Banner } from './types';

export const INITIAL_CATEGORIES: Category[] = ${JSON.stringify(categories, null, 2)};

export const INITIAL_BANNERS: Banner[] = ${JSON.stringify(banners, null, 2)};

export const INITIAL_PRODUCTS: Product[] = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync('src/data.ts', dataFileContent);
console.log("Data generated successfully");
