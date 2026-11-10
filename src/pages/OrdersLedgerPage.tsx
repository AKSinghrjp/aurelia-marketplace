import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { 
  FileSpreadsheet, 
  Download, 
  ShoppingBag, 
  Gavel, 
  Search, 
  Filter, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileCheck, 
  Phone, 
  MapPin 
} from 'lucide-react';

export const OrdersLedgerPage: React.FC = () => {
  const { orders, exportSalesToExcel, exportSalesToCsv } = useMarketplace();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterChannel, setFilterChannel] = useState<'All' | 'Direct Store' | 'Auction Winner'>('All');

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Channel filter
    if (filterChannel !== 'All' && (order.saleType || 'Direct Store') !== filterChannel) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCust = order.customerName.toLowerCase().includes(q);
      const matchPhone = order.customerPhone.toLowerCase().includes(q);
      const matchSeller = (order.sellerName || '').toLowerCase().includes(q);
      const matchItem = order.items.some((it) => it.product.title.toLowerCase().includes(q));
      if (!matchId && !matchCust && !matchPhone && !matchSeller && !matchItem) return false;
    }

    return true;
  });

  const totalSalesRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const directStoreSalesCount = orders.filter((o) => (o.saleType || 'Direct Store') === 'Direct Store').length;
  const auctionSalesCount = orders.filter((o) => o.saleType === 'Auction Winner').length;
  const estimatedGstTotal = Math.round((totalSalesRevenue * 0.18) / 1.18);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner with Excel Linking */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0d1811] via-[#142319] to-[#0c160f] p-6 sm:p-8 rounded-3xl border border-[#234d31] shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileSpreadsheet className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold font-mono tracking-widest uppercase text-emerald-300">
                EXCEL SALES REPORTING SYSTEM • LIVE SYNC
              </span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              Platform Sales & Product Ledger
            </h1>

            <p className="text-xs text-stone-300 leading-relaxed">
              Consolidated audit report of all items sold through AURELIA—whether acquired via the Direct Product Catalog or won on the Live Auction Floor. Includes statutory seller GSTIN records and buyer shipping destinations.
            </p>
          </div>

          {/* Excel Export Buttons with Glass Hover Effect */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 flex-shrink-0">
            <button
              onClick={exportSalesToExcel}
              className="glass-tab py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-black font-extrabold text-xs transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-black" />
              Export to Excel (.xlsx)
            </button>
            <button
              onClick={exportSalesToCsv}
              className="glass-tab py-3 px-4 rounded-xl bg-[#14261b] border border-emerald-600/50 hover:bg-[#1a3324] text-emerald-300 font-bold text-xs transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              CSV Format
            </button>
          </div>
        </div>

        {/* Responsive Metrics Grid - Guaranteed NO OVERFLOW */}
        <div className="mt-8 pt-6 border-t border-[#1d3d27] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Sold Products */}
          <div className="glass-card p-4 rounded-2xl bg-black/50 border border-[#1b3b25] min-w-0 flex flex-col justify-between overflow-hidden shadow-lg">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
              Total Sold Products
            </span>
            <div className="text-xl sm:text-2xl font-extrabold font-sans text-emerald-400 truncate mt-1">
              {orders.length}
            </div>
            <span className="text-[10px] text-stone-400 block mt-1 truncate">
              Direct store & auction
            </span>
          </div>

          {/* Card 2: Gross Sales Value (Fixed Overflow) */}
          <div className="glass-card p-4 rounded-2xl bg-black/50 border border-[#1b3b25] min-w-0 flex flex-col justify-between overflow-hidden shadow-lg">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
              Gross Sales Value
            </span>
            <div 
              className="text-base sm:text-lg lg:text-xl xl:text-2xl font-extrabold font-sans text-stone-100 truncate mt-1" 
              title={`₹${totalSalesRevenue.toLocaleString('en-IN')}`}
            >
              ₹{totalSalesRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1 truncate font-medium">
              Escrow settled
            </span>
          </div>

          {/* Card 3: Sales by Channel (Clean Pill Badges, No Clashing) */}
          <div className="glass-card p-4 rounded-2xl bg-black/50 border border-[#1b3b25] min-w-0 flex flex-col justify-between overflow-hidden shadow-lg">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
              Sales by Channel
            </span>
            <div className="text-xs font-bold text-stone-200 mt-1 flex flex-wrap items-center gap-1.5">
              <span className="bg-[#121c16] px-2 py-0.5 rounded border border-[#1f3d28] text-[#c5a059]">
                Store: {directStoreSalesCount}
              </span>
              <span className="bg-[#1c150c] px-2 py-0.5 rounded border border-[#3d2d18] text-amber-400">
                Auction: {auctionSalesCount}
              </span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-1 truncate">
              Verified transactions
            </span>
          </div>

          {/* Card 4: Estimated GST Collected (Fixed Overflow) */}
          <div className="glass-card p-4 rounded-2xl bg-black/50 border border-[#1b3b25] min-w-0 flex flex-col justify-between overflow-hidden shadow-lg">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-semibold">
              Estimated GST Collected
            </span>
            <div 
              className="text-base sm:text-lg lg:text-xl xl:text-2xl font-extrabold font-sans text-stone-200 truncate mt-1" 
              title={`₹${estimatedGstTotal.toLocaleString('en-IN')}`}
            >
              ₹{estimatedGstTotal.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-stone-500 block mt-1 truncate">
              B2C/B2B Invoices
            </span>
          </div>

        </div>
      </div>

      {/* Filter and Search Bar with Glass Tabs */}
      <div className="glass-card bg-[#10141c] p-4 rounded-2xl border border-[#263244] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID, lot title, seller GST, customer name or phone..."
            className="w-full bg-[#161d29] border border-[#2b394d] rounded-xl py-2 pl-10 pr-4 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Channel Filter Pills with Glowing Glass Hover */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-stone-400 text-[11px] font-semibold">Filter Channel:</span>
          {(['All', 'Direct Store', 'Auction Winner'] as const).map((channel) => (
            <button
              key={channel}
              onClick={() => setFilterChannel(channel)}
              className={`glass-tab px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterChannel === channel
                  ? 'bg-emerald-600 text-black font-bold shadow-md shadow-emerald-950 border-emerald-500'
                  : 'bg-[#18212e] text-stone-300 hover:text-white'
              }`}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Sold Products Report Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
            <span>Sold Inventory Records ({filteredOrders.length})</span>
            <span className="text-xs font-mono text-emerald-400 font-normal">● Live Synced</span>
          </h3>
          <span className="text-xs text-stone-400">
            Clicking "Export to Excel" generates a multi-column `.xlsx` workbook.
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-[#263345] bg-[#0f131a] shadow-xl">
          <table className="w-full text-left text-xs text-stone-300">
            <thead className="bg-[#171f2b] text-[10px] uppercase font-bold text-stone-400 border-b border-[#263345]">
              <tr>
                <th className="p-4">Reference / ID</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Sold Item / Lot</th>
                <th className="p-4">Seller & GSTIN</th>
                <th className="p-4">Customer & Phone</th>
                <th className="p-4">Sale Amount</th>
                <th className="p-4">Est. GST</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2635]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    No sales records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const channel = ord.saleType || 'Direct Store';
                  const firstItem = ord.items[0]?.product;
                  const itemTitle = firstItem?.title || 'Antique Lot';
                  const itemCategory = firstItem?.category || 'Antique';
                  const sellerName = firstItem?.sellerName || ord.sellerName || 'Verified Merchant';
                  const sellerGst = firstItem?.sellerGst || ord.sellerGst || '27AAACA1234D1Z8';
                  const gstAmount = Math.round((ord.totalAmount * 0.18) / 1.18);

                  return (
                    <tr key={ord.id} className="hover:bg-[#141a24] transition-colors">
                      {/* ID & Date */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-stone-100 block">
                          {ord.id}
                        </span>
                        <span className="text-[10px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3 text-stone-500" />
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Sale Channel */}
                      <td className="p-4">
                        {channel === 'Auction Winner' ? (
                          <span className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-800 flex items-center gap-1 w-fit">
                            <Gavel className="w-3 h-3 text-amber-400" />
                            Auction Sale
                          </span>
                        ) : (
                          <span className="bg-[#1d1710] text-[#d6b77c] px-2 py-0.5 rounded text-[10px] font-bold border border-[#4d3a24] flex items-center gap-1 w-fit">
                            <ShoppingBag className="w-3 h-3 text-[#c5a059]" />
                            Direct Sale
                          </span>
                        )}
                      </td>

                      {/* Product Title & Category */}
                      <td className="p-4 max-w-[220px]">
                        <div className="font-semibold text-stone-200 line-clamp-1">{itemTitle}</div>
                        <div className="text-[10px] text-[#c5a059] font-medium">{itemCategory}</div>
                      </td>

                      {/* Seller & GST */}
                      <td className="p-4">
                        <div className="font-medium text-stone-300">{sellerName}</div>
                        <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <FileCheck className="w-2.5 h-2.5 text-emerald-400" />
                          GST: {sellerGst}
                        </div>
                      </td>

                      {/* Customer & Compulsory Phone */}
                      <td className="p-4 max-w-[180px]">
                        <div className="font-medium text-stone-200">{ord.customerName}</div>
                        <div className="text-[10px] text-stone-400 font-mono flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5 text-amber-400" />
                          {ord.customerPhone}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate mt-0.5" title={ord.shippingAddress}>
                          <MapPin className="w-2.5 h-2.5 inline mr-0.5 text-stone-500" />
                          {ord.shippingAddress}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="p-4 font-mono font-bold text-stone-100 text-sm">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </td>

                      {/* GST */}
                      <td className="p-4 font-mono text-stone-400 text-xs">
                        ₹{gstAmount.toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 w-fit ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : 'bg-sky-950/80 text-sky-300 border-sky-800'
                        }`}>
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          {ord.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
