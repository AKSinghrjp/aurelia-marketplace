import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Gavel, 
  ShoppingBag, 
  Package, 
  Crown, 
  TrendingUp, 
  FileCheck, 
  Clock, 
  ArrowRight,
  FileSpreadsheet 
} from 'lucide-react';
import { AuctionItem, Product } from '../types';

interface CustomerDashboardPageProps {
  setCurrentPage: (page: string) => void;
  onOpenAuction: (auction: AuctionItem) => void;
  onOpenProduct: (product: Product) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  setCurrentPage,
  onOpenAuction,
  onOpenProduct,
}) => {
  const { currentUser } = useAuth();
  const { orders, auctions, exportSalesToExcel } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'bids' | 'orders' | 'profile'>('bids');

  if (!currentUser || currentUser.role !== 'customer') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <UserIcon className="w-12 h-12 mx-auto text-[#c5a059]/60" />
        <h2 className="font-serif text-2xl font-bold text-stone-100">
          Collector Hub Access
        </h2>
        <p className="text-xs text-stone-400 max-w-md mx-auto">
          Please sign in as a collector to view your active auction bids and acquired treasures.
        </p>
      </div>
    );
  }

  // Filter orders for this customer
  const myOrders = orders.filter((o) => o.customerId === currentUser.id || o.customerName === currentUser.name);

  // Filter auctions where this customer has participated
  const myAuctions = auctions.filter((a) =>
    a.bidsHistory.some((b) => b.bidderId === currentUser.id || b.bidderName === currentUser.name)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Customer Profile Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#171c26] via-[#12161f] to-[#0e1219] border border-[#2b3648] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#c5a059]/40 p-0.5 flex-shrink-0 shadow-lg"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                  {currentUser.name}
                </h1>
                <span className="bg-[#241c10] text-[#d6b77c] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#4d3a22]">
                  MEMBER COLLECTOR
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Collector ID: <span className="font-mono text-stone-300">{currentUser.id}</span>
              </p>
              
              {/* Compulsory Credentials Preview */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="bg-[#161c27] px-3 py-1 rounded-lg border border-[#2b374a] text-stone-200 flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  Phone: {currentUser.phone}
                </span>
                <span className="bg-[#161c27] px-3 py-1 rounded-lg border border-[#2b374a] text-stone-300 flex items-center gap-1.5 truncate max-w-sm">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                  {currentUser.address}, {currentUser.city}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentPage('auctions')}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <Gavel className="w-4 h-4 text-black" />
              Live Auction Hall
            </button>
            <button
              onClick={() => setCurrentPage('marketplace')}
              className="py-2.5 px-4 rounded-xl bg-[#1b2230] border border-[#303c4f] hover:bg-[#252f42] text-stone-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
              Product Catalog
            </button>
            <button
              onClick={exportSalesToExcel}
              className="py-2.5 px-3 rounded-xl bg-[#142319] border border-emerald-600/50 hover:bg-[#1c3323] text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              Excel Ledger
            </button>
          </div>
        </div>

        {/* Quick Collector Stats */}
        <div className="mt-8 pt-6 border-t border-[#202938] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-[#26354a]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Participating Auctions</span>
            <span className="text-2xl font-bold font-sans text-amber-400">{myAuctions.length}</span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-[#26354a]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Acquisitions / Orders</span>
            <span className="text-2xl font-bold font-sans text-emerald-400">{myOrders.length}</span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-[#26354a]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Escrow Protected</span>
            <span className="text-base font-bold text-stone-100 flex items-center gap-1 mt-1">
              <FileCheck className="w-4 h-4 text-emerald-400" /> Active
            </span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-[#26354a]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">White-Glove Tier</span>
            <span className="text-base font-bold text-[#c5a059] flex items-center gap-1 mt-1">
              <Crown className="w-4 h-4" /> Aristocrat
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#212b3a] text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveTab('bids')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'bids'
              ? 'bg-[#18212e] text-amber-400 border-t-2 border-amber-500'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          My Live Auction Bids ({myAuctions.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-[#18212e] text-[#c5a059] border-t-2 border-[#c5a059]'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          My Order History ({myOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'profile'
              ? 'bg-[#18212e] text-sky-400 border-t-2 border-sky-500'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Collector Profile & Credentials
        </button>
      </div>

      {/* TAB 1: MY AUCTION BIDS */}
      {activeTab === 'bids' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Auctions You Are Actively Contesting
            </h3>
            <button
              onClick={() => setCurrentPage('auctions')}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Browse Live Auction Floor <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myAuctions.length === 0 ? (
            <div className="text-center py-16 bg-[#11151e] rounded-2xl border border-[#2b3648] p-6 space-y-3">
              <Gavel className="w-10 h-10 mx-auto text-stone-600" />
              <p className="text-xs text-stone-400">You haven't placed bids on any active auction lots yet.</p>
              <button
                onClick={() => setCurrentPage('auctions')}
                className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-lg"
              >
                Join an Active Auction
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAuctions.map((auc) => {
                const isLeading = auc.highestBidderId === currentUser.id;
                const myHighestBid = auc.bidsHistory
                  .filter((b) => b.bidderId === currentUser.id || b.bidderName === currentUser.name)
                  .sort((a, b) => b.amount - a.amount)[0];

                return (
                  <div
                    key={auc.id}
                    className={`p-4 rounded-xl border flex gap-4 bg-[#131822] ${
                      isLeading ? 'border-emerald-700/80' : 'border-[#2e3b4f]'
                    }`}
                  >
                    <img
                      src={auc.images[0]}
                      alt={auc.title}
                      className="w-24 h-24 rounded-lg object-cover bg-black/40 flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] mb-1">
                          <span className="text-[#c5a059] font-medium">{auc.category} • {auc.era.split('(')[0]}</span>
                          {isLeading ? (
                            <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-800 flex items-center gap-1">
                              <Crown className="w-3 h-3 text-amber-400" /> YOU ARE WINNING
                            </span>
                          ) : (
                            <span className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-800">
                              OUTBID
                            </span>
                          )}
                        </div>

                        <h4 className="font-serif text-xs font-semibold text-stone-100 line-clamp-1">
                          {auc.title}
                        </h4>

                        <div className="mt-2 text-xs text-stone-400 flex items-center justify-between">
                          <span>
                            Your Highest: <strong className="text-stone-200 font-mono">₹{myHighestBid?.amount.toLocaleString('en-IN')}</strong>
                          </span>
                          <span>
                            Floor Bid: <strong className="text-amber-400 font-mono">₹{auc.currentBid.toLocaleString('en-IN')}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#232d3d] flex items-center justify-between">
                        <span className="text-[10px] text-stone-500 font-mono">
                          Seller GST: {auc.sellerGst.slice(0, 7)}...
                        </span>
                        <button
                          onClick={() => onOpenAuction(auc)}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs"
                        >
                          {isLeading ? 'Monitor Bids' : 'Place Counter-Bid'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Acquisition History & Tax Invoices
            </h3>
            <button
              onClick={() => setCurrentPage('marketplace')}
              className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-semibold"
            >
              Acquire More Collectibles <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myOrders.length === 0 ? (
            <div className="text-center py-16 bg-[#11151e] rounded-2xl border border-[#2b3648] p-6 space-y-3">
              <ShoppingBag className="w-10 h-10 mx-auto text-stone-600" />
              <p className="text-xs text-stone-400">You haven't made any acquisitions yet.</p>
              <button
                onClick={() => setCurrentPage('marketplace')}
                className="px-4 py-2 bg-[#c5a059] text-black font-bold text-xs rounded-lg"
              >
                Browse Product Gallery
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl bg-[#131822] border border-[#273344] flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-xs">
                        Order #{ord.id}
                      </span>
                      <span className="text-[10px] text-stone-500">
                        • {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                      <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                        {ord.status}
                      </span>
                      <span className="text-[10px] bg-[#1a2333] text-stone-300 px-2 py-0.5 rounded border border-[#283952]">
                        {ord.saleType || 'Direct Store'}
                      </span>
                    </div>

                    <div className="text-xs text-stone-200">
                      {ord.items.map((it) => (
                        <div key={it.product.id} className="font-medium">
                          {it.product.title} (x{it.quantity})
                        </div>
                      ))}
                    </div>

                    <div className="text-[11px] text-stone-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#c5a059]" />
                      <span>Destination: {ord.shippingAddress}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold font-mono text-stone-100">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">
                      {ord.paymentMethod}
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-1 inline-block">
                      ✓ Insured Escrow Transit
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: COLLECTOR PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-[#12161f] p-6 rounded-2xl border border-[#293547] space-y-4 text-xs text-stone-300">
          <h3 className="font-serif text-base font-bold text-stone-100">
            Registered Collector Credentials
          </h3>
          <p className="text-[11px] text-stone-400">
            These credentials are used to issue statutory GST buyer receipts and dispatch armored curatorial couriers.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-3 rounded-xl bg-[#0c1017] border border-[#222c3b]">
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Collector Full Name</span>
              <span className="font-medium text-stone-100">{currentUser.name}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0c1017] border border-[#222c3b]">
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Compulsory Phone Number</span>
              <span className="font-medium text-amber-400 font-mono">{currentUser.phone}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0c1017] border border-[#222c3b]">
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Registered Email</span>
              <span className="font-medium text-stone-200">{currentUser.email}</span>
            </div>

            <div className="p-3 rounded-xl bg-[#0c1017] border border-[#222c3b]">
              <span className="text-stone-500 block text-[10px] uppercase font-bold">City & PIN</span>
              <span className="font-medium text-stone-200">{currentUser.city} - {currentUser.pincode}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1017] border border-[#222c3b]">
            <span className="text-stone-500 block text-[10px] uppercase font-bold">Physical Delivery Vault / Address</span>
            <span className="font-medium text-stone-200">{currentUser.address}</span>
          </div>
        </div>
      )}

    </div>
  );
};
