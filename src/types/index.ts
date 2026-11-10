export type UserRole = 'admin' | 'seller' | 'customer';

export type SellerVerificationStatus = 'pending' | 'verified' | 'rejected';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  password: string; // Secure credential with strict validation
  phone: string; // Compulsory for both seller & customer
  address?: string; // Compulsory for customer
  city?: string;
  pincode?: string;
  gstNumber?: string; // Compulsory for seller (15 alphanumeric characters)
  businessName?: string; // For seller
  verificationStatus?: SellerVerificationStatus; // For seller
  avatar?: string;
  createdAt: string;
}

// 5 Product Categories: 1st antique, 2nd currency, 3rd diecast, 4th fashion, 5th luxury
export type ProductCategory =
  | 'Antique'
  | 'Currency'
  | 'Diecast'
  | 'Fashion'
  | 'Luxury';

// 4 Auction Categories: 1st antiques, 2nd fashion, 3rd currency, 4th voiture
export type AuctionCategory =
  | 'Antiques'
  | 'Fashion'
  | 'Currency'
  | 'Voiture';

export type AntiqueEra =
  | 'Ancient & Classical (Pre-500 AD)'
  | 'Medieval (500–1500 AD)'
  | 'Renaissance & Baroque (1500–1750)'
  | 'Victorian & Edwardian (1837–1910)'
  | 'Art Nouveau & Art Deco (1890–1940)'
  | 'Mid-Century & Retro (1940–1980)'
  | 'Vintage Modern (1980–2000s)';

export type ConditionGrade =
  | 'Pristine / Museum Grade'
  | 'Mint in Original Box (MIB)'
  | 'Excellent (Minor Natural Patina)'
  | 'Good / Authentically Preserved'
  | 'Restored Vintage State';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerGst: string;
  title: string;
  description: string;
  provenance: string;
  certificateOfAuthenticity: boolean;
  era: AntiqueEra;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  stockQuantity: number;
  condition: ConditionGrade;
  images: string[];
  featured?: boolean;
  rating: number;
  reviewsCount: number;
  yearOrCentury: string;
  originCountry: string;
  dimensions?: string;
  weight?: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
}

export interface AuctionItem {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerGst: string;
  title: string;
  description: string;
  provenance: string;
  category: AuctionCategory;
  era: AntiqueEra;
  condition: ConditionGrade;
  images: string[];
  startingBid: number;
  reservePrice: number;
  currentBid: number;
  minIncrement: number;
  startTime: string; // ISO
  endTime: string; // ISO
  status: 'upcoming' | 'live' | 'ended';
  highestBidderId?: string;
  highestBidderName?: string;
  totalBids: number;
  certificateOfAuthenticity: boolean;
  featured?: boolean;
  yearOrCentury: string;
  originCountry: string;
  bidsHistory: Bid[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Processing' | 'Dispatched' | 'Delivered';
  paymentMethod: string;
  createdAt: string;
  saleType: 'Direct Store' | 'Auction Winner';
  sellerName?: string;
  sellerGst?: string;
  auctionId?: string;
}

export interface PlatformQuery {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userEmail: string;
  userPhone?: string;
  category: 'General' | 'Auction Bid Issue' | 'GST & Seller Verification' | 'Order & Shipping' | 'Authentication & Provenance';
  subject: string;
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  adminResponse?: string;
  createdAt: string;
  updatedAt?: string;
}
