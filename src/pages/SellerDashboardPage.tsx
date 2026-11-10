import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Building2, 
  FileCheck, 
  Phone, 
  Gavel, 
  Store, 
  Plus, 
  TrendingUp, 
  Clock, 
  Package, 
  DollarSign, 
  AlertCircle, 
  Trash2, 
  CheckCircle2, 
  Eye,
  FileSpreadsheet,
  MapPin 
} from 'lucide-react';
import { Product, AuctionItem } from '../types';

interface SellerDashboardPageProps {
  openCreateAuction: () => void;
  openCreateProduct: () => void;
  onOpenProduct: (product: Product) => void;
  onOpenAuction: (auction: AuctionItem) => void;
}

export const SellerDashboardPage: React.FC<SellerDashboardPageProps> = ({
  openCreateAuction,
  openCreateProduct,
  onOpenProduct,
  onOpenAuction,
}) => {
  const { currentUser } = useAuth();
  const { products, auctions, orders, deleteProduct, deleteAuction, exportSalesToExcel } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'auctions' | 'products' | 'orders'>('auctions');

  if (!currentUser || currentUser.role !== 'seller') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Building2 className="w-12 h-12 mx-auto text-amber-500/60" />
        <h2 className="font-serif text-2xl font-bold text-stone-100">
          Product Seller Studio Access
        </h2>
        <p className="text-xs text-stone-400 max-w-md mx-auto">
          Please sign in as a registered antique seller to access listing controls and auction generation.
        </p>
      </div>
    );
  }

  // Filter seller's items
  const myProducts = products.filter((p) => p.sellerId === currentUser.id || p.sellerGst === currentUser.gstNumber);
  const myAuctions = auctions.filter((a) => a.sellerId === currentUser.id || a.sellerGst === currentUser.gstNumber);
  
  // Total stats
  const totalAuctionVolume = myAuctions.reduce((sum, a) => sum + a.currentBid, 0);
  const totalBidsReceived = myAuctions.reduce((sum, a) => sum + a.totalBids, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Seller Credentials & Compliance Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1b150c] via-[#241a0e] to-[#17120a] border border-[#4d3a20] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#12161f] border border-amber-500/40 p-1 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg">
              <Building2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                  {currentUser.businessName || currentUser.name}
                </h1>
                {currentUser.verificationStatus === 'verified' ? (
                  <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    GST VERIFIED
                  </span>
                ) : (
                  <span className="bg-amber-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    VERIFICATION PENDING
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-400">
                Curator Representative: <strong className="text-stone-200">{currentUser.name}</strong> • {currentUser.email}
              </p>

              {/* Compulsory GST & Phone Display */}
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="bg-[#0e1218] px-3 py-1 rounded-lg border border-[#344055] font-mono text-emerald-400 flex items-center gap-1.5 shadow-inner">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                  COMPULSORY GSTIN: <strong>{currentUser.gstNumber || 'NOT REGISTERED'}</strong>
                </span>

                <span className="bg-[#0e1218] px-3 py-1 rounded-lg border border-[#344055] text-stone-200 flex items-center gap-1.5 shadow-inner">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  COMPULSORY PHONE: <strong>{currentUser.phone || 'NOT REGISTERED'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Create Buttons & Excel Export */}
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <button
              onClick={openCreateAuction}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-extrabold text-xs transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
            >
              <Gavel className="w-4 h-4 text-black" />
              Generate Auction Lot
            </button>
            <button
              onClick={openCreateProduct}
              className="py-3 px-5 rounded-xl bg-[#191f2b] border border-[#3b4b66] hover:bg-[#252f42] text-stone-100 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 text-[#c5a059]" />
              List Catalog Product
            </button>
            <button
              onClick={exportSalesToExcel}
              className="py-3 px-4 rounded-xl bg-[#122419] border border-emerald-600/50 hover:bg-[#1a3324] text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
              title="Download Excel Sales Report"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Sales Excel
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-8 pt-6 border-t border-[#312516] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-[#362917]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Active Auction Lots</span>
            <span className="text-2xl font-bold font-sans text-amber-400">{myAuctions.length}</span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-[#362917]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Catalog Products Listed</span>
            <span className="text-2xl font-bold font-sans text-stone-100">{myProducts.length}</span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-[#362917]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Total Bids Received</span>
            <span className="text-2xl font-bold font-sans text-emerald-400">{totalBidsReceived}</span>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-[#362917]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Auction Bidding Value</span>
            <span className="text-2xl font-bold font-sans text-stone-100">₹{totalAuctionVolume.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#261f15] text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveTab('auctions')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'auctions'
              ? 'bg-[#181c26] text-amber-400 border-t-2 border-amber-500'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          My Auction Lots ({myAuctions.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'products'
              ? 'bg-[#181c26] text-[#c5a059] border-t-2 border-[#c5a059]'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          My Catalog Products ({myProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-[#181c26] text-emerald-400 border-t-2 border-emerald-500'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Settlements & Escrow Orders ({orders.length})
        </button>
      </div>

      {/* TAB 1: AUCTIONS */}
      {activeTab === 'auctions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Active & Scheduled Auction Lots
            </h3>
            <button
              onClick={openCreateAuction}
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              + Generate Another Auction Lot
            </button>
          </div>

          {myAuctions.length === 0 ? (
            <div className="text-center py-16 bg-[#11151e] rounded-2xl border border-[#2b3648] p-6 space-y-3">
              <Gavel className="w-10 h-10 mx-auto text-stone-600" />
              <p className="text-xs text-stone-400">You haven't generated any auction lots yet.</p>
              <button
                onClick={openCreateAuction}
                className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-lg"
              >
                Create Your First Auction Lot (Antiques, Fashion, Currency, Voiture)
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#2b3648] bg-[#11151e]">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#171d29] text-[10px] uppercase font-bold text-stone-400 border-b border-[#2b3648]">
                  <tr>
                    <th className="p-3.5">Lot Title</th>
                    <th className="p-3.5">Department</th>
                    <th className="p-3.5">Where Available</th>
                    <th className="p-3.5">Starting Bid</th>
                    <th className="p-3.5">Current Highest Bid</th>
                    <th className="p-3.5">Bids</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2736]">
                  {myAuctions.map((auc) => (
                    <tr key={auc.id} className="hover:bg-[#161c27]">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={auc.images[0]}
                          alt={auc.title}
                          className="w-10 h-10 rounded-lg object-cover bg-black/40 flex-shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-stone-100 line-clamp-1 max-w-[200px]">
                            {auc.title}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            Era: {auc.era.split('(')[0]}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-amber-300">{auc.category}</td>
                      <td className="p-3.5 text-stone-300">
                        <span className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-[#c5a059]" /> {auc.originCountry}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono">₹{auc.startingBid.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 font-mono font-bold text-amber-400">
                        ₹{auc.currentBid.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 font-bold">{auc.totalBids}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          auc.status === 'live'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-700'
                            : auc.status === 'upcoming'
                            ? 'bg-sky-950/80 text-sky-300 border border-sky-700'
                            : 'bg-stone-800 text-stone-400'
                        }`}>
                          {auc.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => onOpenAuction(auc)}
                          className="p-1.5 rounded bg-[#1e2533] hover:bg-[#2b3548] text-amber-300 text-xs"
                          title="Enter Live Auction Room"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAuction(auc.id)}
                          className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs"
                          title="Withdraw Lot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATALOG PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Standard Direct-Sale Catalog Listings
            </h3>
            <button
              onClick={openCreateProduct}
              className="text-xs text-[#c5a059] hover:underline flex items-center gap-1 font-semibold"
            >
              + List Another Product
            </button>
          </div>

          {myProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#11151e] rounded-2xl border border-[#2b3648] p-6 space-y-3">
              <Store className="w-10 h-10 mx-auto text-stone-600" />
              <p className="text-xs text-stone-400">No products listed under this seller profile.</p>
              <button
                onClick={openCreateProduct}
                className="px-4 py-2 bg-[#c5a059] text-black font-bold text-xs rounded-lg"
              >
                List Your First Product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#2b3648] bg-[#11151e]">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-[#171d29] text-[10px] uppercase font-bold text-stone-400 border-b border-[#2b3648]">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Subcategory (5)</th>
                    <th className="p-3.5">Where Available</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2736]">
                  {myProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#161c27]">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-10 h-10 rounded-lg object-cover bg-black/40 flex-shrink-0"
                        />
                        <div>
                          <span className="font-semibold text-stone-100 line-clamp-1 max-w-[200px]">
                            {p.title}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            Era: {p.era.split('(')[0]}
                          </span>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-[#c5a059]">{p.category}</td>
                      <td className="p-3.5 text-stone-300">
                        <span className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-amber-400" /> {p.originCountry}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-stone-100">
                        ₹{p.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 font-mono">
                        <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded text-[11px] border border-emerald-900">
                          {p.stockQuantity} units
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-amber-400">★ {p.rating}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => onOpenProduct(p)}
                          className="p-1.5 rounded bg-[#1e2533] hover:bg-[#2b3548] text-stone-200 text-xs"
                          title="View Product"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="p-1.5 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Escrow Sales & Customer Dispatches
            </h3>
            <button
              onClick={exportSalesToExcel}
              className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Download Excel Sales Ledger
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#2b3648] bg-[#11151e]">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-[#171d29] text-[10px] uppercase font-bold text-stone-400 border-b border-[#2b3648]">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Customer & Phone</th>
                  <th className="p-3.5">Delivery Address</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Settlement Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2736]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#161c27]">
                    <td className="p-3.5 font-mono text-amber-400 font-bold">{ord.id}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] bg-[#1a202c] px-2 py-0.5 rounded font-semibold text-stone-300">
                        {ord.saleType || 'Direct Store'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-200">{ord.customerName}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{ord.customerPhone}</div>
                    </td>
                    <td className="p-3.5 max-w-[200px] truncate text-stone-400">
                      {ord.shippingAddress}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-stone-100">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-400 text-[11px]">{ord.paymentMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
