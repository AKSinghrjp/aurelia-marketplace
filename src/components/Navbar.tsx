import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  Gavel, 
  Store, 
  ShieldCheck, 
  ShoppingBag, 
  User as UserIcon, 
  Search, 
  Compass, 
  Sparkles, 
  Crown,
  ChevronDown,
  Building2,
  Phone,
  FileCheck,
  FileSpreadsheet,
  HelpCircle,
  Menu
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openAuthModal: () => void;
  openCartDrawer: () => void;
  toggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  openAuthModal,
  openCartDrawer,
  toggleSidebar,
}) => {
  const { currentUser, switchUser, users, logout } = useAuth();
  const { cart, searchQuery, setSearchQuery, exportSalesToExcel } = useMarketplace();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#0e1117]/95 backdrop-blur-md border-b border-[#2a241e] text-stone-100 shadow-2xl">
      {/* Top Heritage Notice Bar */}
      <div className="bg-gradient-to-r from-[#1f1912] via-[#2d2214] to-[#1f1912] border-b border-[#3d2f1b] px-4 py-1.5 text-xs text-[#d6b77c]">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <span className="flex items-center gap-1.5 font-serif tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
            AURELIA | Curated Collector Marketplace & Real-Time Live Auction House
          </span>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-stone-300">
            <button
              onClick={exportSalesToExcel}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Live Excel Sales Sync
            </button>
            <span className="flex items-center gap-1">
              <FileCheck className="w-3 h-3 text-[#c5a059]" /> Mandatory GST Sellers
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#c5a059]" /> Insured Escrow
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Left section: Hamburger (Mobile) + Brand Logo */}
          <div className="flex items-center gap-3">
            {toggleSidebar && (
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg bg-[#151922] border border-[#2d3748] text-stone-300 hover:text-white md:hidden"
                title="Toggle Left Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div 
              onClick={() => setCurrentPage('home')}
              className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            >
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#c5a059] via-[#8c6b2d] to-[#463514] p-0.5 shadow-lg shadow-[#c5a059]/20 group-hover:shadow-[#c5a059]/40 transition-all">
                <div className="w-full h-full bg-[#12151b] rounded-[6px] flex items-center justify-center">
                  <Crown className="w-6 h-6 text-[#c5a059] group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div>
                <div className="font-serif tracking-widest text-2xl font-bold bg-gradient-to-r from-[#FAF6EE] via-[#E2C792] to-[#C5A059] bg-clip-text text-transparent">
                  AURELIA
                </div>
                <div className="text-[10px] tracking-[0.25em] text-[#a89269] uppercase font-sans -mt-1 font-semibold">
                  Collectibles & Auctions
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-[#a89269] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (currentPage !== 'marketplace') {
                    setCurrentPage('marketplace');
                  }
                }}
                placeholder="Search antiques, rare currency, diecast models, luxury watches..."
                className="w-full bg-[#161a22] border border-[#342b1f] rounded-full py-2 pl-10 pr-4 text-xs text-stone-200 placeholder-stone-400 focus:outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-all"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            
            {/* Standard Products Catalog */}
            <button
              onClick={() => setCurrentPage('marketplace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                currentPage === 'marketplace'
                  ? 'bg-[#261f14] text-[#e8c888] border border-[#6b5025]'
                  : 'text-stone-300 hover:text-white hover:bg-[#181d26]'
              }`}
            >
              <Store className="w-4 h-4 text-[#c5a059]" />
              <span className="hidden sm:inline">Product Catalog</span>
            </button>

            {/* Special Auction House */}
            <button
              onClick={() => setCurrentPage('auctions')}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                currentPage === 'auctions'
                  ? 'bg-[#2a1b14] text-[#f59e0b] border border-[#92400e]'
                  : 'text-stone-300 hover:text-white hover:bg-[#181d26]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <Gavel className="w-4 h-4 text-[#f59e0b]" />
              <span className="hidden sm:inline font-semibold">Live Auctions</span>
            </button>

            {/* Excel Sales Ledger Button */}
            <button
              onClick={() => setCurrentPage('orders')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                currentPage === 'orders'
                  ? 'bg-[#132319] text-emerald-300 border border-emerald-600'
                  : 'text-stone-300 hover:text-white hover:bg-[#181d26]'
              }`}
              title="Sales Ledger & Excel Report"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Excel Report</span>
            </button>

            {/* Role Dedicated Portal Button */}
            {currentUser && (
              <button
                onClick={() => {
                  if (currentUser.role === 'admin') setCurrentPage('admin');
                  else if (currentUser.role === 'seller') setCurrentPage('seller');
                  else setCurrentPage('customer');
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                  ['admin', 'seller', 'customer'].includes(currentPage)
                    ? 'bg-[#c5a059]/20 text-[#f3dfb2] border-[#c5a059]'
                    : 'border-[#382d1c] bg-[#141820] text-stone-200 hover:border-[#c5a059]/50'
                }`}
              >
                {currentUser.role === 'admin' && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                {currentUser.role === 'seller' && <Building2 className="w-4 h-4 text-amber-400" />}
                {currentUser.role === 'customer' && <Compass className="w-4 h-4 text-sky-400" />}
                <span className="hidden xl:inline capitalize">
                  {currentUser.role === 'admin' ? 'Admin' : currentUser.role === 'seller' ? 'Seller Studio' : 'Collector'}
                </span>
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={openCartDrawer}
              className="relative p-2.5 text-stone-300 hover:text-white hover:bg-[#1c222c] rounded-lg transition-all"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Role Switcher & Account Menu */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-[#382d1c] bg-[#13171f] hover:bg-[#1c222c] text-xs transition-all"
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-[#c5a059]/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-[#2a2215] flex items-center justify-center text-[#c5a059]">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="text-left hidden 2xl:block">
                  <div className="text-[11px] font-medium leading-none text-stone-200 truncate max-w-[110px]">
                    {currentUser?.name || 'Sign In'}
                  </div>
                  <div className="text-[10px] text-[#c5a059] uppercase tracking-wider font-semibold">
                    {currentUser?.role ? `${currentUser.role}` : 'Guest'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {/* Role Switcher Dropdown */}
              {showRoleDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-[#141822] border border-[#3b3020] rounded-xl shadow-2xl py-2 z-50 text-stone-200 divide-y divide-[#262016]"
                  onMouseLeave={() => setShowRoleDropdown(false)}
                >
                  <div className="px-4 py-2 text-xs">
                    <p className="text-[10px] uppercase tracking-widest text-[#a89269] font-bold">
                      Current Profile
                    </p>
                    {currentUser ? (
                      <div className="mt-1">
                        <p className="font-semibold text-stone-100">{currentUser.name}</p>
                        <p className="text-[11px] text-stone-400">{currentUser.email}</p>
                        {currentUser.gstNumber && (
                          <p className="text-[10px] text-amber-400 font-mono mt-0.5">
                            GST: {currentUser.gstNumber}
                          </p>
                        )}
                        {currentUser.phone && (
                          <p className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5 text-[#c5a059]" /> {currentUser.phone}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-stone-400 mt-1">Not signed in</p>
                    )}
                  </div>

                  {/* Fast 1-Click Role Switcher */}
                  <div className="p-2">
                    <p className="text-[10px] font-bold tracking-wider text-[#d5ba80] px-2 py-1 uppercase">
                      Switch Role Demo:
                    </p>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setShowRoleDropdown(false);
                          if (u.role === 'admin') setCurrentPage('admin');
                          else if (u.role === 'seller') setCurrentPage('seller');
                          else setCurrentPage('customer');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-all ${
                          currentUser?.id === u.id
                            ? 'bg-[#2b2214] text-[#f2dab0] font-semibold'
                            : 'hover:bg-[#1a202c] text-stone-300'
                        }`}
                      >
                        <div>
                          <div className="capitalize flex items-center gap-1.5 font-medium">
                            {u.role === 'admin' && '🛡️ Admin'}
                            {u.role === 'seller' && (u.verificationStatus === 'verified' ? '💼 Verified Seller' : '⏳ Pending Seller')}
                            {u.role === 'customer' && '🏺 Collector'}
                          </div>
                          <div className="text-[10px] text-stone-400 truncate max-w-[170px]">
                            {u.name}
                          </div>
                        </div>
                        {u.gstNumber && (
                          <span className="text-[9px] bg-[#101e14] text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-900/60 font-mono">
                            GST
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowRoleDropdown(false);
                        openAuthModal();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[#c5a059] hover:bg-[#1f1910] rounded-lg font-medium"
                    >
                      + Login / Register New Account
                    </button>
                    {currentUser && (
                      <button
                        onClick={() => {
                          logout();
                          setShowRoleDropdown(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 rounded-lg font-medium"
                      >
                        Sign Out
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </nav>
        </div>
      </div>
    </header>
  );
};
