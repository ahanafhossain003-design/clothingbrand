import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { get, set, del } from 'idb-keyval';
import { Product, Category, Banner, CartItem, Order } from '../types';

// Custom IndexedDB storage
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('IDB Timeout')), ms);
    promise.then(value => {
      clearTimeout(timer);
      resolve(value);
    }).catch(err => {
      clearTimeout(timer);
      reject(err);
    });
  });
};

const storage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return (await withTimeout(get(name), 5000)) || null;
    } catch (e) {
      console.warn('idb get error, falling back to localStorage', e);
      try { return localStorage.getItem(name); } catch(err) { return null; }
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await withTimeout(set(name, value), 5000);
    } catch (e) {
      console.warn('idb set error, falling back to localStorage', e);
      try { localStorage.setItem(name, value); } catch(err) {}
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await withTimeout(del(name), 5000);
    } catch (e) {
      console.warn('idb del error, falling back to localStorage', e);
      try { localStorage.removeItem(name); } catch(err) {}
    }
  },
};
import { generateId } from '../lib/utils';
import { INITIAL_BANNERS, INITIAL_CATEGORIES, INITIAL_PRODUCTS } from '../data';

// --- STORE INTERFACES ---
interface AppState {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Banner Settings
  bannerSlideshow: boolean;
  toggleBannerSlideshow: () => void;
  
  // Data
  categories: Category[];
  banners: Banner[];
  products: Product[];
  orders: Order[];
  
  // Admin Actions
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  deleteBanner: (id: string) => void;
  updateBannerOrder: (banners: Banner[]) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateOrderPaymentStatus: (id: string, status: Order['paymentInfo']['status']) => void;
  markOrderAsViewed: (id: string) => void;
  markAllOrdersAsViewed: () => void;
  updateAllPendingToConfirmed: () => void;
  
  // Admin Auth
  adminPhone?: string;
  setAdminPhone: (phone: string) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
  
  // User Actions
  cart: CartItem[];
  wishlist: string[]; // Product IDs
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDarkMode: true, // Default to dark for luxury theme
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      bannerSlideshow: true,
      toggleBannerSlideshow: () => set((state) => ({ bannerSlideshow: !state.bannerSlideshow })),

      categories: INITIAL_CATEGORIES,
      banners: INITIAL_BANNERS,
      products: INITIAL_PRODUCTS,
      orders: [],
      
      cart: [],
      wishlist: [],
      
      adminPhone: '',
      setAdminPhone: (phone) => set({ adminPhone: phone }),
      isAdminAuthenticated: false,
      loginAdmin: () => set({ isAdminAuthenticated: true }),
      logoutAdmin: () => set({ isAdminAuthenticated: false }),
      
      addCategory: (category) => set((state) => ({
        categories: [...state.categories, { ...category, id: generateId() }]
      })),
      updateCategory: (id, category) => set((state) => ({
        categories: state.categories.map(c => c.id === id ? { ...c, ...category } : c)
      })),
      deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter(c => c.id !== id)
      })),
      
      addBanner: async (banner) => {
        const newBanner = { ...banner, id: generateId() };
        try { await import("../lib/supabase").then(m => m.supabase.from("banners").insert([{ id: newBanner.id, image_url: newBanner.imageUrl, title: newBanner.title, subtitle: newBanner.subtitle, link: newBanner.link, "order": newBanner.order }])); } catch(e) { console.error(e); }
        set((state) => ({ banners: [...state.banners, newBanner] }));
      },
      deleteBanner: (id) => set((state) => ({
        banners: state.banners.filter(b => b.id !== id)
      })),
      updateBannerOrder: (banners) => set({ banners }),
      
      addProduct: (product) => set((state) => ({
        products: [...state.products, { ...product, id: generateId() }]
      })),
      updateProduct: (id, data) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...data } : p)
      })),
      deleteProduct: (id) => set((state) => ({
        products: state.products.filter(p => p.id !== id)
      })),
      
      addOrder: (order) => set((state) => ({
        orders: [{ ...order, id: generateId(), createdAt: new Date().toISOString() }, ...state.orders]
      })),
      updateOrderStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, status } : o)
      })),
      updateOrderPaymentStatus: (id, status) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, paymentInfo: { ...o.paymentInfo, status } } : o)
      })),
      markOrderAsViewed: (id) => set((state) => ({
        orders: state.orders.map(o => o.id === id ? { ...o, isViewed: true } : o)
      })),
      markAllOrdersAsViewed: () => set((state) => ({
        orders: state.orders.map(o => ({ ...o, isViewed: true }))
      })),
      updateAllPendingToConfirmed: () => set((state) => ({
        orders: state.orders.map(o => o.status === 'Pending order' ? { ...o, status: 'Confirmed order' } : o)
      })),
      
      addToCart: (item) => set((state) => {
        const existing = state.cart.find(i => 
          i.productId === item.productId && 
          i.size === item.size && 
          i.color === item.color
        );
        if (existing) {
          return {
            cart: state.cart.map(i => i.id === existing.id 
              ? { ...i, quantity: i.quantity + item.quantity } 
              : i
            )
          };
        }
        return {
          cart: [...state.cart, { ...item, id: generateId() }]
        };
      }),
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter(i => i.id !== id)
      })),
      updateCartQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map(i => i.id === id ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ cart: [] }),
      
      toggleWishlist: (productId) => set((state) => ({
        wishlist: state.wishlist.includes(productId)
          ? state.wishlist.filter(id => id !== productId)
          : [...state.wishlist, productId]
      })),
    }),
    {
      name: 'aurelius-store-v8',
      storage: createJSONStorage(() => storage),
    }
  )
);
