export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  categoryId: string;
  images: string[];
  sizes: string[];
  sizeChartImage?: string;
  colors: string[];
  inventory: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  pinned?: boolean;
}

export interface Banner {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  link?: string;
  order: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  isViewed?: boolean;
  status: 'Pending order' | 'Confirmed order';
  customerInfo: {
    fullName: string;
    mobileNumber: string;
    email: string;
    fullAddress: string;
    notes?: string;
  };
  paymentInfo: {
    method: 'Cash on Delivery' | 'bKash' | 'Nagad';
    senderNumber?: string;
    transactionId?: string;
    status: 'Pending' | 'Pending Verification' | 'Verified' | 'Rejected';
  };
  items: OrderItem[];
  totalAmount: number;
}
