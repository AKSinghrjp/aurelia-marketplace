import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  AuctionItem, 
  CartItem, 
  Order, 
  Bid, 
  ProductCategory, 
  AuctionCategory, 
  PlatformQuery 
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_AUCTIONS, INITIAL_ORDERS, INITIAL_QUERIES } from '../data/initialData';
import { downloadExcelSalesReport, downloadCsvSalesReport } from '../utils/excelExport';
import confetti from 'canvas-confetti';

interface MarketplaceContextType {
  products: Product[];
  auctions: AuctionItem[];
  cart: CartItem[];
  orders: Order[];
  queries: PlatformQuery[];
  activeProductModal: Product | null;
  activeAuctionModal: AuctionItem | null;
  setActiveProductModal: (prod: Product | null) => void;
  setActiveAuctionModal: (auc: AuctionItem | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedEra: string;
  setSelectedEra: (era: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (orderDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
  }) => { success: boolean; orderId?: string; message?: string };
  placeBid: (
    auctionId: string,
    amount: number,
    bidderId: string,
    bidderName: string
  ) => { success: boolean; message: string };
  simulateRivalBid: (auctionId: string) => { success: boolean; rivalName?: string; newBid?: number };
  createProduct: (data: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => Product;
  createAuction: (data: Omit<AuctionItem, 'id' | 'currentBid' | 'totalBids' | 'bidsHistory' | 'status'>) => AuctionItem;
  deleteProduct: (productId: string) => void;
  deleteAuction: (auctionId: string) => void;
  concludeAuctionSale: (auctionId: string, customerId: string, customerName: string, customerPhone: string, shippingAddress: string) => Order | null;
  submitQuery: (data: {
    userId: string;
    userName: string;
    userRole: any;
    userEmail: string;
    userPhone?: string;
    category: any;
    subject: string;
    message: string;
  }) => PlatformQuery;
  respondToQuery: (queryId: string, response: string, newStatus: 'Open' | 'In Progress' | 'Resolved') => void;
  exportSalesToExcel: () => void;
  exportSalesToCsv: () => void;
}

const PRODUCTS_STORAGE_KEY = 'aurelia_products_v2';
const AUCTIONS_STORAGE_KEY = 'aurelia_auctions_v2'; // v2 ensures removed example auctions stay empty!
const ORDERS_STORAGE_KEY = 'aurelia_orders_v2';
const QUERIES_STORAGE_KEY = 'aurelia_queries_v2';
const CART_STORAGE_KEY = 'aurelia_cart_v2';

const MarketplaceContext = createContext<MarketplaceContextType | undefined>(undefined);

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [auctions, setAuctions] = useState<AuctionItem[]>(() => {
    const saved = localStorage.getItem(AUCTIONS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_AUCTIONS; // Initial auctions starts empty
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [queries, setQueries] = useState<PlatformQuery[]>(() => {
    const saved = localStorage.getItem(QUERIES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_QUERIES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [activeAuctionModal, setActiveAuctionModal] = useState<AuctionItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEra, setSelectedEra] = useState<string>('All');

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(AUCTIONS_STORAGE_KEY, JSON.stringify(auctions));
  }, [auctions]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(queries));
  }, [queries]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Keep activeAuctionModal in sync if bids update
  useEffect(() => {
    if (activeAuctionModal) {
      const updated = auctions.find((a) => a.id === activeAuctionModal.id);
      if (updated) {
        setActiveAuctionModal(updated);
      }
    }
  }, [auctions]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockQuantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stockQuantity) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stockQuantity) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const checkout = (orderDetails: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: string;
  }) => {
    if (cart.length === 0) {
      return { success: false, message: 'Your cart is empty.' };
    }

    const totalAmount = cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const firstItem = cart[0]?.product;

    const newOrder: Order = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: orderDetails.customerId,
      customerName: orderDetails.customerName,
      customerEmail: orderDetails.customerEmail,
      customerPhone: orderDetails.customerPhone,
      shippingAddress: orderDetails.shippingAddress,
      items: [...cart],
      totalAmount,
      status: 'Processing',
      paymentMethod: orderDetails.paymentMethod,
      createdAt: new Date().toISOString(),
      saleType: 'Direct Store',
      sellerName: firstItem?.sellerName || 'Verified Antique Gallery',
      sellerGst: firstItem?.sellerGst || '27AAACA1234D1Z8',
    };

    // Deduct stock
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((ci) => ci.product.id === p.id);
        if (cartItem) {
          return { ...p, stockQuantity: Math.max(0, p.stockQuantity - cartItem.quantity) };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C5A059', '#E5C07B', '#FFFFFF'],
      });
    } catch {
      // ignore
    }

    return { success: true, orderId: newOrder.id };
  };

  const placeBid = (
    auctionId: string,
    amount: number,
    bidderId: string,
    bidderName: string
  ): { success: boolean; message: string } => {
    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction) return { success: false, message: 'Auction not found.' };

    const now = new Date();
    const end = new Date(auction.endTime);
    if (now >= end || auction.status === 'ended') {
      return { success: false, message: 'This auction has ended.' };
    }

    const minRequired = auction.currentBid + auction.minIncrement;
    if (amount < minRequired) {
      return {
        success: false,
        message: `Bid must be at least ₹${minRequired.toLocaleString('en-IN')}`,
      };
    }

    const newBid: Bid = {
      id: `bid-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      auctionId,
      bidderId,
      bidderName,
      amount,
      timestamp: new Date().toISOString(),
    };

    // Anti-sniping: extend by 2 minutes if placed in last 2 minutes
    let newEndTime = auction.endTime;
    const diffMs = end.getTime() - now.getTime();
    if (diffMs < 2 * 60 * 1000) {
      newEndTime = new Date(now.getTime() + 2 * 60 * 1000).toISOString();
    }

    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auctionId
          ? {
              ...a,
              currentBid: amount,
              highestBidderId: bidderId,
              highestBidderName: bidderName,
              totalBids: a.totalBids + 1,
              endTime: newEndTime,
              bidsHistory: [newBid, ...a.bidsHistory],
            }
          : a
      )
    );

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#C5A059', '#D4AF37', '#FAF6EE'],
      });
    } catch {
      // ignore
    }

    return {
      success: true,
      message: `Leading bid placed at ₹${amount.toLocaleString('en-IN')}!`,
    };
  };

  const simulateRivalBid = (auctionId: string) => {
    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction) return { success: false };

    const rivalCollectors = [
      'Baron von Steinberg (Vienna)',
      'Lady Catherine Dunmore (Edinburgh)',
      'Geneva Horology Syndicate',
      'Archduke Numismatics Fund',
      'The Rajputana Curio Society',
      'Antiquarian Guild of Cambridge',
    ];
    const rivalName = rivalCollectors[Math.floor(Math.random() * rivalCollectors.length)];
    const rivalId = `rival-${Date.now()}`;
    const increment = auction.minIncrement * (Math.random() > 0.5 ? 2 : 1);
    const newAmount = auction.currentBid + increment;

    const newBid: Bid = {
      id: `bid-rival-${Date.now()}`,
      auctionId,
      bidderId: rivalId,
      bidderName: rivalName,
      amount: newAmount,
      timestamp: new Date().toISOString(),
    };

    setAuctions((prev) =>
      prev.map((a) =>
        a.id === auctionId
          ? {
              ...a,
              currentBid: newAmount,
              highestBidderId: rivalId,
              highestBidderName: rivalName,
              totalBids: a.totalBids + 1,
              bidsHistory: [newBid, ...a.bidsHistory],
            }
          : a
      )
    );

    return { success: true, rivalName, newBid: newAmount };
  };

  // Convert an ended auction to an official sold product ledger record
  const concludeAuctionSale = (
    auctionId: string,
    customerId: string,
    customerName: string,
    customerPhone: string,
    shippingAddress: string
  ): Order | null => {
    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction) return null;

    const convertedProduct: Product = {
      id: `auc-sold-${auction.id}`,
      sellerId: auction.sellerId,
      sellerName: auction.sellerName,
      sellerGst: auction.sellerGst,
      title: auction.title,
      description: auction.description,
      provenance: auction.provenance,
      certificateOfAuthenticity: auction.certificateOfAuthenticity,
      era: auction.era,
      category: (auction.category === 'Voiture' ? 'Antique' : auction.category as any) || 'Antique',
      price: auction.currentBid,
      stockQuantity: 1,
      condition: auction.condition,
      images: auction.images,
      rating: 5.0,
      reviewsCount: 1,
      yearOrCentury: auction.yearOrCentury,
      originCountry: auction.originCountry,
      createdAt: new Date().toISOString(),
    };

    const newAuctionOrder: Order = {
      id: `AUC-SETTLE-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId,
      customerName,
      customerEmail: 'collector@aurelia.com',
      customerPhone,
      shippingAddress,
      items: [{ product: convertedProduct, quantity: 1 }],
      totalAmount: auction.currentBid,
      status: 'Processing',
      paymentMethod: 'Auction Escrow Custody Wire',
      createdAt: new Date().toISOString(),
      saleType: 'Auction Winner',
      sellerName: auction.sellerName,
      sellerGst: auction.sellerGst,
      auctionId: auction.id,
    };

    // Update auction status to ended
    setAuctions((prev) =>
      prev.map((a) => (a.id === auctionId ? { ...a, status: 'ended' } : a))
    );

    // Append to orders ledger
    setOrders((prev) => [newAuctionOrder, ...prev]);
    return newAuctionOrder;
  };

  const createProduct = (
    data: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>
  ): Product => {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const createAuction = (
    data: Omit<AuctionItem, 'id' | 'currentBid' | 'totalBids' | 'bidsHistory' | 'status'>
  ): AuctionItem => {
    const now = new Date();
    const start = new Date(data.startTime);
    const status = now >= start ? 'live' : 'upcoming';

    const newAuction: AuctionItem = {
      ...data,
      id: `auc-${Date.now()}`,
      currentBid: data.startingBid,
      totalBids: 0,
      bidsHistory: [],
      status,
    };

    setAuctions((prev) => [newAuction, ...prev]);
    return newAuction;
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const deleteAuction = (auctionId: string) => {
    setAuctions((prev) => prev.filter((a) => a.id !== auctionId));
  };

  // Queries Functions
  const submitQuery = (data: {
    userId: string;
    userName: string;
    userRole: any;
    userEmail: string;
    userPhone?: string;
    category: any;
    subject: string;
    message: string;
  }): PlatformQuery => {
    const newQuery: PlatformQuery = {
      id: `QRY-${Math.floor(100 + Math.random() * 900)}`,
      userId: data.userId,
      userName: data.userName,
      userRole: data.userRole,
      userEmail: data.userEmail,
      userPhone: data.userPhone,
      category: data.category,
      subject: data.subject,
      message: data.message,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };

    setQueries((prev) => [newQuery, ...prev]);
    return newQuery;
  };

  const respondToQuery = (
    queryId: string,
    response: string,
    newStatus: 'Open' | 'In Progress' | 'Resolved'
  ) => {
    setQueries((prev) =>
      prev.map((q) =>
        q.id === queryId
          ? {
              ...q,
              adminResponse: response,
              status: newStatus,
              updatedAt: new Date().toISOString(),
            }
          : q
      )
    );
  };

  const exportSalesToExcel = () => {
    downloadExcelSalesReport(orders);
  };

  const exportSalesToCsv = () => {
    downloadCsvSalesReport(orders);
  };

  return (
    <MarketplaceContext.Provider
      value={{
        products,
        auctions,
        cart,
        orders,
        queries,
        activeProductModal,
        activeAuctionModal,
        setActiveProductModal,
        setActiveAuctionModal,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedEra,
        setSelectedEra,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkout,
        placeBid,
        simulateRivalBid,
        concludeAuctionSale,
        createProduct,
        createAuction,
        deleteProduct,
        deleteAuction,
        submitQuery,
        respondToQuery,
        exportSalesToExcel,
        exportSalesToCsv,
      }}
    >
      {children}
    </MarketplaceContext.Provider>
  );
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within MarketplaceProvider');
  }
  return context;
};
