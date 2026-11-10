import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  ShieldCheck, 
  Building2, 
  FileCheck, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Gavel, 
  Store, 
  TrendingUp, 
  Trash2, 
  Eye, 
  Users,
  FileSpreadsheet,
  Download,
  MapPin 
} from 'lucide-react';
import { Product, AuctionItem, User } from '../types';

interface AdminDashboardPageProps {
  onOpenProduct: (product: Product) => void;
  onOpenAuction: (auction: AuctionItem) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onOpenProduct,
  onOpenAuction,
}) => {
  const { currentUser, users, updateSellerStatus } = useAuth();
  const { products, auctions, orders, deleteProduct, deleteAuction, exportSalesToExcel, exportSalesToCsv } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'sellers' | 'auctions' | 'products' | 'orders'>('sellers');

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500/60" />
        <h2 className="font-serif text-2xl font-bold text-stone-100">
          Admin Master Chamber Access Restricted
        </h2>
        <p className="text-xs text-stone-400 max-w-md mx-auto">
          Please log in as an administrator to supervise platform curators, GST verifications, and auction records.
        </p>
      </div>
    );
  }

  const sellersList = users.filter((u) => u.role === 'seller');
  const customersList = users.filter((u) => u.role === 'customer');

  const totalMarketVolume =
    orders.reduce((sum, o) => sum + o.totalAmount, 0) +
    auctions.reduce((sum, a) => sum + a.currentBid, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Master Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#141b24] via-[#10141c] to-[#0d1017] border border-[#2e3e57] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 p-1 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                  Master Curatorial Admin Chamber
                </h1>
                <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700">
                  ROOT ADMIN
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Administrator: <strong className="text-stone-200">{currentUser.name}</strong> • {currentUser.email}
              </p>
              <div className="text-[11px] text-[#c5a059] font-mono pt-1">
                Aurelia Platform Governance & Statutory Seller GSTIN Oversight
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportSalesToExcel}
              className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Download Excel Sales Report
            </button>
            <div className="p-3 rounded-xl bg-[#17212f] border border-[#2b3a50] text-right">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Gross Curatorial Volume</span>
              <span className="text-xl font-bold font-sans text-amber-400">
                ₹{totalMarketVolume.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Admin KPI Cards */}
        <div className="mt-8 pt-6 border-t border-[#202b3c] grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-black/40 border border-[#26354a]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Registered Sellers</span>
            <span className="text-2xl font-bold font-sans text-amber-400">{sellersList.length}</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Mandatory GST check</span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-[#26354a]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Live & Timed Auctions</span>
            <span className="text-2xl font-bold font-sans text-stone-100">{auctions.length}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Active bidding floor</span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-[#26354a]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Catalog Products</span>
            <span className="text-2xl font-bold font-sans text-stone-100">{products.length}</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">5 Subcategories</span>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-[#26354a]">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block">Collectors / Buyers</span>
            <span className="text-2xl font-bold font-sans text-sky-400">{customersList.length}</span>
            <span className="text-[10px] text-stone-500 block mt-0.5">Verified shipping profiles</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#202c3d] text-xs font-semibold gap-2">
        <button
          onClick={() => setActiveTab('sellers')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'sellers'
              ? 'bg-[#18212e] text-amber-400 border-t-2 border-amber-500'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Seller Verification Center ({sellersList.length})
        </button>
        <button
          onClick={() => setActiveTab('auctions')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'auctions'
              ? 'bg-[#18212e] text-stone-100 border-t-2 border-stone-400'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Auction Floor Moderation ({auctions.length})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'products'
              ? 'bg-[#18212e] text-stone-100 border-t-2 border-stone-400'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Catalog Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-5 rounded-t-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-[#18212e] text-emerald-400 border-t-2 border-emerald-500'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          Escrow Orders Ledger ({orders.length})
        </button>
      </div>

      {/* TAB 1: SELLER VERIFICATION CENTER */}
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#141b24] border border-[#273549] flex items-center justify-between text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-amber-300">Mandatory Statutory Seller GST Compliance</span>
                <p className="text-[11px] text-stone-400">
                  Antiquities and Curios merchants must possess a verified 15-character GSTIN and active business phone line. Admins have authority to approve or revoke merchant listing privileges.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#2b3a4f] bg-[#111721]">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-[#17202d] text-[10px] uppercase font-bold text-stone-400 border-b border-[#2b3a4f]">
                <tr>
                  <th className="p-3.5">Firm / Gallery</th>
                  <th className="p-3.5">Representative</th>
                  <th className="p-3.5">Compulsory GST Number</th>
                  <th className="p-3.5">Compulsory Phone</th>
                  <th className="p-3.5">Location</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2a3c]">
                {sellersList.map((seller) => (
                  <tr key={seller.id} className="hover:bg-[#151c27]">
                    <td className="p-3.5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1e2736] flex items-center justify-center text-amber-400 font-bold">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-100">
                          {seller.businessName || seller.name}
                        </div>
                        <div className="text-[10px] text-stone-500">{seller.email}</div>
                      </div>
                    </td>
                    <td className="p-3.5 text-stone-200">{seller.name}</td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-[#0c1219] px-2 py-1 rounded border border-[#24354a]">
                        {seller.gstNumber || 'MISSING'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-xs text-stone-200 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-amber-400" />
                        {seller.phone || 'MISSING'}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-400">{seller.city || 'India'}</td>
                    <td className="p-3.5">
                      {seller.verificationStatus === 'verified' && (
                        <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-700 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          VERIFIED
                        </span>
                      )}
                      {seller.verificationStatus === 'pending' && (
                        <span className="bg-amber-950/80 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-700 flex items-center gap-1 w-fit">
                          <AlertCircle className="w-3 h-3 text-amber-400" />
                          PENDING REVIEW
                        </span>
                      )}
                      {seller.verificationStatus === 'rejected' && (
                        <span className="bg-rose-950/80 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-700 flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3 text-rose-400" />
                          REJECTED
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {seller.verificationStatus !== 'verified' && (
                        <button
                          onClick={() => updateSellerStatus(seller.id, 'verified')}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs"
                        >
                          Approve GST
                        </button>
                      )}
                      {seller.verificationStatus !== 'rejected' && (
                        <button
                          onClick={() => updateSellerStatus(seller.id, 'rejected')}
                          className="px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs"
                        >
                          Revoke / Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUCTION MODERATION */}
      {activeTab === 'auctions' && (
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Platform-Wide Auction Floor Control (Antiques, Fashion, Currency, Voiture)
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[#2b3a4f] bg-[#111721]">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-[#17202d] text-[10px] uppercase font-bold text-stone-400 border-b border-[#2b3a4f]">
                <tr>
                  <th className="p-3.5">Auction Lot</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Host Seller & GST</th>
                  <th className="p-3.5">Starting Bid</th>
                  <th className="p-3.5">Current Leading</th>
                  <th className="p-3.5">Bids</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2a3c]">
                {auctions.map((auc) => (
                  <tr key={auc.id} className="hover:bg-[#151c27]">
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
                        <span className="text-[10px] text-stone-500 block">{auc.yearOrCentury}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-amber-300">{auc.category}</td>
                    <td className="p-3.5">
                      <div className="text-amber-400 font-medium">{auc.sellerName}</div>
                      <div className="text-[10px] font-mono text-stone-400">GST: {auc.sellerGst}</div>
                    </td>
                    <td className="p-3.5 font-mono">₹{auc.startingBid.toLocaleString('en-IN')}</td>
                    <td className="p-3.5 font-mono font-bold text-amber-400">
                      ₹{auc.currentBid.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 font-bold">{auc.totalBids}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950/80 text-amber-300 border border-amber-800">
                        {auc.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onOpenAuction(auc)}
                        className="p-1.5 rounded bg-[#1e2736] hover:bg-[#2b384d] text-stone-200"
                        title="View Lot"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteAuction(auc.id)}
                        className="p-1.5 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-300"
                        title="Remove Lot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PRODUCTS MODERATION */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Catalog Listings Moderation (Antique, Currency, Diecast, Fashion, Luxury)
          </h3>

          <div className="overflow-x-auto rounded-xl border border-[#2b3a4f] bg-[#111721]">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-[#17202d] text-[10px] uppercase font-bold text-stone-400 border-b border-[#2b3a4f]">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Subcategory (5)</th>
                  <th className="p-3.5">Where Available</th>
                  <th className="p-3.5">Merchant</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2a3c]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#151c27]">
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
                        <span className="text-[10px] text-stone-500 block">{p.era.split('(')[0]}</span>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-[#c5a059]">{p.category}</td>
                    <td className="p-3.5 text-stone-300">
                      <span className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-amber-400" /> {p.originCountry}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="text-stone-300 font-medium">{p.sellerName}</div>
                      <div className="text-[10px] font-mono text-emerald-400">GST: {p.sellerGst}</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-stone-100">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 font-mono">{p.stockQuantity} units</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onOpenProduct(p)}
                        className="p-1.5 rounded bg-[#1e2736] hover:bg-[#2b384d] text-stone-200"
                        title="Inspect"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 rounded bg-rose-950/50 hover:bg-rose-900/60 text-rose-300"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GLOBAL ESCROW ORDERS LEDGER */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Platform Escrow Transactions & Invoicing Ledger
            </h3>
            <button
              onClick={exportSalesToExcel}
              className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Export to Excel (.xlsx)
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#2b3a4f] bg-[#111721]">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-[#17202d] text-[10px] uppercase font-bold text-stone-400 border-b border-[#2b3a4f]">
                <tr>
                  <th className="p-3.5">Order ID</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Customer & Contact</th>
                  <th className="p-3.5">Items Acquired</th>
                  <th className="p-3.5">Total Settlement</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Escrow Custody Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2a3c]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#151c27]">
                    <td className="p-3.5 font-mono font-bold text-amber-400">{ord.id}</td>
                    <td className="p-3.5">
                      <span className="text-[10px] bg-[#18212e] text-stone-200 px-2 py-0.5 rounded font-semibold">
                        {ord.saleType || 'Direct Store'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-200">{ord.customerName}</div>
                      <div className="text-[10px] font-mono text-stone-400">{ord.customerPhone}</div>
                      <div className="text-[10px] text-stone-500">{ord.customerEmail}</div>
                    </td>
                    <td className="p-3.5">
                      {ord.items.map((it) => (
                        <div key={it.product.id} className="line-clamp-1 max-w-[200px]">
                          • {it.product.title}
                        </div>
                      ))}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-stone-100">
                      ₹{ord.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5">
                      <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-800">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-400">{ord.paymentMethod}</td>
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
