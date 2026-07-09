import { Product, Category, Banner } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: "c1", name: "Shirts", slug: "shirts" },
  { id: "c2", name: "T-Shirts", slug: "t-shirts" },
  { id: "c3", name: "Pants", slug: "pants" },
  { id: "c4", name: "Jeans", slug: "jeans" },
  { id: "c5", name: "Jackets", slug: "jackets" },
  { id: "c6", name: "Shoes", slug: "shoes" },
  { id: "c7", name: "Watches", slug: "watches" },
  { id: "c8", name: "Accessories", slug: "accessories" }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: "b1",
    imageUrl: "https://videos.pexels.com/video-files/5008581/5008581-uhd_2160_3840_25fps.mp4",
    title: "LUXURY COLLECTION",
    subtitle: "Redefining Elegance for the Modern Era",
    order: 1
  },
  {
    id: "b2",
    imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop",
    title: "AUTUMN ESSENTIALS",
    subtitle: "Embrace the Season in Style",
    order: 2
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Classic White Dress Shirt",
    description: "A tailored white dress shirt perfect for formal occasions. Crisp cotton poplin with a standard collar.",
    price: 120,
    categoryId: "c1",
    images: ["https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=800&auto=format&fit=crop"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    inventory: 50,
    featured: true
  },
  {
    id: "p2",
    name: "Navy Blue Oxford Shirt",
    description: "A single navy blue oxford shirt. Casual yet refined, perfect for the office or weekend wear.",
    price: 95,
    categoryId: "c1",
    images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=800&auto=format&fit=crop"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy"],
    inventory: 40,
    featured: false
  },
  {
    id: "p3",
    name: "Essential Cotton T-Shirt",
    description: "A single premium cotton crew neck t-shirt. Soft, breathable, and an everyday staple.",
    price: 45,
    categoryId: "c2",
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    inventory: 100,
    featured: true
  },
  {
    id: "p4",
    name: "Black Graphic T-Shirt",
    description: "A single black t-shirt with a minimalist graphic design on the chest.",
    price: 55,
    categoryId: "c2",
    images: ["https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=800&auto=format&fit=crop"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    inventory: 80,
    featured: false
  },
  {
    id: "p5",
    name: "Tailored Chino Pants",
    description: "A single pair of slim-fit chino pants. Versatile enough for both office and casual wear.",
    price: 85,
    categoryId: "c3",
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop"],
    sizes: ["30", "32", "34", "36"],
    colors: ["Navy"],
    inventory: 60,
    featured: false
  },
  {
    id: "p6",
    name: "Olive Cargo Pants",
    description: "A single pair of olive green cargo pants with utility pockets and a relaxed fit.",
    price: 95,
    categoryId: "c3",
    images: ["https://images.unsplash.com/photo-1555689502-c4b22d76c56f?q=80&w=800&auto=format&fit=crop"],
    sizes: ["30", "32", "34", "36"],
    colors: ["Olive"],
    inventory: 50,
    featured: false
  },
  {
    id: "p7",
    name: "Classic Blue Jeans",
    description: "A single pair of classic denim jeans. Durable fabric with a comfortable straight fit.",
    price: 110,
    categoryId: "c4",
    images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop"],
    sizes: ["30", "32", "34", "36"],
    colors: ["Blue"],
    inventory: 45,
    featured: true
  },
  {
    id: "p8",
    name: "Black Skinny Jeans",
    description: "A single pair of black skinny fit jeans. Made with stretch denim for ultimate comfort.",
    price: 115,
    categoryId: "c4",
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop"],
    sizes: ["30", "32", "34", "36"],
    colors: ["Black"],
    inventory: 55,
    featured: false
  },
  {
    id: "p9",
    name: "Leather Moto Jacket",
    description: "A single premium leather motorcycle jacket with silver hardware and asymmetric zip.",
    price: 450,
    categoryId: "c5",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"],
    sizes: ["M", "L", "XL"],
    colors: ["Black"],
    inventory: 15,
    featured: true
  },
  {
    id: "p10",
    name: "Denim Trucker Jacket",
    description: "A single light blue denim jacket with classic button-front styling and chest pockets.",
    price: 130,
    categoryId: "c5",
    images: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=800&auto=format&fit=crop"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Light Blue"],
    inventory: 35,
    featured: false
  },
  {
    id: "p11",
    name: "Sport Running Shoe",
    description: "A single pair of high-performance running shoes in a striking red colorway.",
    price: 140,
    categoryId: "c6",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop"],
    sizes: ["8", "9", "10", "11", "12"],
    colors: ["Red"],
    inventory: 30,
    featured: true
  },
  {
    id: "p12",
    name: "White Leather Sneakers",
    description: "A single pair of clean, minimalist white leather sneakers. Perfect for everyday casual wear.",
    price: 125,
    categoryId: "c6",
    images: ["https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop"],
    sizes: ["8", "9", "10", "11", "12"],
    colors: ["White"],
    inventory: 60,
    featured: false
  },
  {
    id: "p13",
    name: "Minimalist Wristwatch",
    description: "A single elegant wristwatch featuring a black leather strap and a clean white dial.",
    price: 220,
    categoryId: "c7",
    images: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop"],
    sizes: ["One Size"],
    colors: ["Black/Silver"],
    inventory: 20,
    featured: true
  },
  {
    id: "p14",
    name: "Chronograph Steel Watch",
    description: "A single premium chronograph watch with a stainless steel link band and a navy blue dial.",
    price: 350,
    categoryId: "c7",
    images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=800&auto=format&fit=crop"],
    sizes: ["One Size"],
    colors: ["Silver/Navy"],
    inventory: 12,
    featured: false
  },
  {
    id: "p15",
    name: "Classic Sunglasses",
    description: "A single pair of timeless sunglasses with UV protection and durable frames.",
    price: 135,
    categoryId: "c8",
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop"],
    sizes: ["One Size"],
    colors: ["Black"],
    inventory: 40,
    featured: false
  },
  {
    id: "p16",
    name: "Leather Bifold Wallet",
    description: "A single premium brown leather bifold wallet with multiple card slots and a classic design.",
    price: 75,
    categoryId: "c8",
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=800&auto=format&fit=crop"],
    sizes: ["One Size"],
    colors: ["Brown"],
    inventory: 45,
    featured: true
  }
];
