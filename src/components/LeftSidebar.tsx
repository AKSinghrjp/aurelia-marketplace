import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  User, 
  Gavel, 
  Store, 
  ShoppingBag, 
  HelpCircle, 
  FileSpreadsheet, 
  ShieldCheck, 
  Building2, 
  Compass, 
  ChevronRight, 
  Crown, 
  Coins, 
  Car, 
  Sparkles, 
  Shirt, 
  Gem, 
  Landmark 
} from 'lucide-react';

interface LeftSidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openCreateAuction: () => void;
  openCreateProduct: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentPage,
  setCurrentPage,
  openCreateAuction,
  openCreateProduct,
}) => {
  const { currentUser } = useAuth();
  const { auctions, orders, queries, exportSalesToExcel } = useMarketplace();

  const liveAuctionsCount = auctions.filter((a) => a.status === 'live').length;
  const openQueriesCount = queries.filter((q) => q.status === 'Open').length;

  const navigateToProfile = () => {
    if (currentUser?.role === 'admin') setCurrentPage('admin');
    else if (currentUser?.role === 'seller') setCurrentPage('seller');
    else setCurrentPage('customer');
  };

  return (
    <aside className="w-64 bg-[#0a0d13] border-r border-[#262016] flex flex-col justify-between h-[calc(100vh-5rem)] sticky top-20 flex-shrink-0 z-30 select-none">
      
      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        
        {/* Main Required Sidebar Options */}
        <div>
          <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-widest text-[#a89269] flex items-center justify-between">
            <span>Navigation Deck</span>
            <span className="text-[9px] text-stone-500 font-mono">v2.0</span>
          </div>

          <nav className="space-y-1">
            
            {/* 1. Profile */}
            <button
              onClick={navigateToProfile}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                ['admin', 'seller', 'customer'].includes(currentPage)
                  ? 'bg-gradient-to-r from-[#2a2012] to-[#1c150b] text-[#f5ebd2] border border-[#c5a059]/60 shadow-md shadow-[#c5a059]/10'
                  : 'text-stone-300 hover:text-white hover:bg-[#141924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#181d28] border border-[#323d4f] flex items-center justify-center text-[#c5a059]">
                  {currentUser?.role === 'admin' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : currentUser?.role === 'seller' ? (
                    <Building2 className="w-4 h-4 text-amber-400" />
                  ) : (
                    <User className="w-4 h-4 text-sky-400" />
                  )}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-stone-100">Profile</div>
                  <div className="text-[10px] text-[#c5a059] capitalize">
                    {currentUser?.role ? `${currentUser.role} Hub` : 'Guest Hub'}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {/* 2. Live Auction */}
            <button
              onClick={() => setCurrentPage('auctions')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentPage === 'auctions'
                  ? 'bg-gradient-to-r from-[#2b1709] to-[#1c0f05] text-[#fcd34d] border border-amber-600/70 shadow-md shadow-amber-500/10'
                  : 'text-stone-300 hover:text-white hover:bg-[#141924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#211509] border border-amber-600/40 flex items-center justify-center text-amber-400">
                  <Gavel className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-stone-100 flex items-center gap-1.5">
                    Live Auction
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  </div>
                  <div className="text-[10px] text-amber-400/80">Floor & Timed Lots</div>
                </div>
              </div>
              {liveAuctionsCount > 0 ? (
                <span className="bg-amber-950/90 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-700">
                  {liveAuctionsCount}
                </span>
              ) : (
                <span className="text-[10px] text-stone-500 font-mono">Floor Open</span>
              )}
            </button>

            {/* 3. Product Listing */}
            <button
              onClick={() => setCurrentPage('marketplace')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentPage === 'marketplace'
                  ? 'bg-gradient-to-r from-[#221c13] to-[#16120b] text-[#f3dfb2] border border-[#c5a059]/60 shadow-md shadow-[#c5a059]/10'
                  : 'text-stone-300 hover:text-white hover:bg-[#141924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#19150e] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059]">
                  <Store className="w-4 h-4 text-[#c5a059]" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-stone-100">Product Listing</div>
                  <div className="text-[10px] text-stone-400">5 Curator Categories</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {/* 4. Orders */}
            <button
              onClick={() => setCurrentPage('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentPage === 'orders'
                  ? 'bg-gradient-to-r from-[#14231a] to-[#0d1611] text-emerald-300 border border-emerald-600/70 shadow-md shadow-emerald-500/10'
                  : 'text-stone-300 hover:text-white hover:bg-[#141924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0e1d14] border border-emerald-600/40 flex items-center justify-center text-emerald-400">
                  <ShoppingBag className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-stone-100">Orders</div>
                  <div className="text-[10px] text-emerald-400/80">Sales & Excel Report</div>
                </div>
              </div>
              <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-800">
                {orders.length}
              </span>
            </button>

            {/* 5. Queries */}
            <button
              onClick={() => setCurrentPage('queries')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                currentPage === 'queries'
                  ? 'bg-gradient-to-r from-[#171f2d] to-[#0f141f] text-sky-300 border border-sky-500/60 shadow-md shadow-sky-500/10'
                  : 'text-stone-300 hover:text-white hover:bg-[#141924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#101724] border border-sky-600/40 flex items-center justify-center text-sky-400">
                  <HelpCircle className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-stone-100">Queries</div>
                  <div className="text-[10px] text-sky-400/80">Support & Inquiries</div>
                </div>
              </div>
              {openQueriesCount > 0 && (
                <span className="bg-sky-950/80 text-sky-300 text-[10px] font-bold px-1.5 py-0.5 rounded border border-sky-800">
                  {openQueriesCount}
                </span>
              )}
            </button>

          </nav>
        </div>

        {/* 5 Product Sub-categories shortcut list */}
        <div className="pt-2 border-t border-[#1d2432]">
          <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-[#a89269]">
            Product Categories (5)
          </div>
          <div className="space-y-1 text-xs">
            {[
              { name: 'Antique', icon: Landmark },
              { name: 'Currency', icon: Coins },
              { name: 'Diecast', icon: Car },
              { name: 'Fashion', icon: Shirt },
              { name: 'Luxury', icon: Gem },
            ].map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => setCurrentPage('marketplace')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-[#141822] text-xs transition-colors"
                >
                  <IconComponent className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Auction Sub-categories shortcut list */}
        <div className="pt-2 border-t border-[#1d2432]">
          <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-amber-400/90 flex items-center gap-1">
            <Gavel className="w-3 h-3 text-amber-400" />
            Auction Departments (4)
          </div>
          <div className="space-y-1 text-xs">
            {[
              { name: 'Antiques', desc: 'Rare artefacts & relics' },
              { name: 'Fashion', desc: 'Historic couture & jewelry' },
              { name: 'Currency', desc: 'Sovereign coins & notes' },
              { name: 'Voiture', desc: 'Classic & vintage cars' },
            ].map((aucCat) => (
              <button
                key={aucCat.name}
                onClick={() => setCurrentPage('auctions')}
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-stone-400 hover:text-amber-300 hover:bg-[#1a140d] text-xs transition-colors"
              >
                <span className="font-medium text-stone-300">{aucCat.name}</span>
                <span className="text-[10px] text-stone-500">{aucCat.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Excel Sales Report Export Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-[#0e1a12] to-[#09110b] border border-[#1e3d29] text-xs text-stone-300 space-y-2">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Excel Sales Ledger</span>
          </div>
          <p className="text-[11px] text-stone-400 leading-relaxed">
            Directly export all sold items (Store + Auctions) to a formatted Microsoft Excel spreadsheet.
          </p>
          <button
            onClick={exportSalesToExcel}
            className="w-full py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export to Excel (.xlsx)
          </button>
        </div>

      </div>

      {/* Sidebar Footer User Card */}
      <div className="p-3 border-t border-[#202736] bg-[#080b0f] text-xs">
        {currentUser ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 truncate max-w-[170px]">
              <div className="w-7 h-7 rounded-full bg-[#1b2230] border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] font-bold text-xs flex-shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="font-semibold text-stone-200 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-[#c5a059] uppercase font-mono">{currentUser.role}</div>
              </div>
            </div>
            {currentUser.role === 'seller' && (
              <button
                onClick={openCreateAuction}
                className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-600/40 text-[10px]"
                title="Create Auction"
              >
                + Lot
              </button>
            )}
          </div>
        ) : (
          <div className="text-center text-stone-400 text-xs py-1">
            Sign in to access features
          </div>
        )}
      </div>

    </aside>
  );
};
