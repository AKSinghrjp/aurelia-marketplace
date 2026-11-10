import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { AuctionCard } from '../components/AuctionCard';
import { AuctionItem, AuctionCategory } from '../types';
import { 
  Gavel, 
  Clock, 
  Flame, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  MapPin, 
  Car, 
  Shirt, 
  Coins, 
  Landmark 
} from 'lucide-react';

interface AuctionHousePageProps {
  onOpenAuction: (auction: AuctionItem) => void;
  openCreateAuction: () => void;
  openAuthModal: () => void;
}

// 4 Auction Subcategories
const AUCTION_CATEGORIES: { name: AuctionCategory; icon: any; desc: string }[] = [
  { name: 'Antiques', icon: Landmark, desc: 'Historical artefacts & heirlooms' },
  { name: 'Fashion', icon: Shirt, desc: 'Haute couture & fine jewels' },
  { name: 'Currency', icon: Coins, desc: 'Sovereign coins & rare notes' },
  { name: 'Voiture', icon: Car, desc: 'Classic cars & collector automobiles' },
];

export const AuctionHousePage: React.FC<AuctionHousePageProps> = ({
  onOpenAuction,
  openCreateAuction,
  openAuthModal,
}) => {
  const { auctions } = useMarketplace();
  const { currentUser } = useAuth();
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterLocation, setFilterLocation] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'live' | 'upcoming' | 'ended'>('all');

  // Locations where lots are available
  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    auctions.forEach((a) => {
      if (a.originCountry) locs.add(a.originCountry);
    });
    return Array.from(locs);
  }, [auctions]);

  const filteredAuctions = useMemo(() => {
    return auctions.filter((a) => {
      if (filterStatus === 'live' && a.status !== 'live') return false;
      if (filterStatus === 'upcoming' && a.status !== 'upcoming') return false;
      if (filterStatus === 'ended' && a.status !== 'ended') return false;

      if (filterCategory !== 'All' && a.category !== filterCategory) return false;
      if (filterLocation !== 'All' && a.originCountry.toLowerCase() !== filterLocation.toLowerCase()) return false;

      return true;
    });
  }, [auctions, filterStatus, filterCategory, filterLocation]);

  const liveCount = auctions.filter((a) => a.status === 'live').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Heritage Live Auction Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#211609] via-[#2f1f0e] to-[#1c1206] p-8 rounded-3xl border border-[#523d20] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-xs font-bold font-mono tracking-widest uppercase text-amber-300">
                LIVE AUCTION FLOOR • REAL-TIME BIDDING
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100">
              The Sovereign Auction Floor
            </h1>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Explore 4 premier auction departments: <strong>Antiques</strong>, <strong>Fashion</strong>, <strong>Currency</strong>, and <strong>Voiture</strong>. Select specifically what you wish to bid on and where the lot is situated.
            </p>
          </div>

          {/* Seller Action: Generate Auction */}
          <div className="flex-shrink-0 flex flex-col sm:flex-row gap-3">
            {currentUser?.role === 'seller' ? (
              <button
                onClick={openCreateAuction}
                className="py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-extrabold text-xs transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 text-black" />
                Generate New Auction
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="py-3 px-5 rounded-xl bg-[#1d1710] border border-[#c5a059] hover:bg-[#c5a059] hover:text-black text-[#c5a059] font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Gavel className="w-4 h-4" />
                Seller? Sign In to Host Auction
              </button>
            )}
          </div>
        </div>

        {/* 4 Auction Subcategory Selector Cards */}
        <div className="mt-8 pt-6 border-t border-[#422e17] grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AUCTION_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = filterCategory === cat.name;
            const count = auctions.filter((a) => a.category === cat.name).length;

            return (
              <div
                key={cat.name}
                onClick={() => setFilterCategory(isSelected ? 'All' : cat.name)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-500 shadow-xl shadow-amber-500/20 font-bold'
                    : 'bg-[#15110a] border-[#382613] text-stone-300 hover:border-amber-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-xs">
                    <IconComponent className="w-4 h-4" />
                    {cat.name}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isSelected ? 'bg-black text-amber-300' : 'bg-black/40 text-stone-400'}`}>
                    {count} lots
                  </span>
                </div>
                <div className={`text-[10px] mt-1 ${isSelected ? 'text-black/80' : 'text-stone-400'}`}>
                  {cat.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar: Status and Location Selection */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#282015] pb-4 text-xs">
        <div className="flex flex-wrap gap-2">
          {(['all', 'live', 'upcoming', 'ended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold capitalize transition-all ${
                filterStatus === status
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                  : 'bg-[#151922] text-stone-400 hover:text-white'
              }`}
            >
              {status === 'live' ? `Live Bidding (${liveCount})` : status}
            </button>
          ))}
          {filterCategory !== 'All' && (
            <button
              onClick={() => setFilterCategory('All')}
              className="px-2.5 py-1 rounded-xl bg-[#291b0f] text-amber-300 border border-amber-800 text-[11px] font-semibold"
            >
              Filter: {filterCategory} ✕
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        {availableLocations.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-stone-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> Location:
            </span>
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="bg-[#17130c] border border-[#3e2e1a] rounded-lg px-2.5 py-1 text-xs text-stone-200"
            >
              <option value="All">All Locations</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>📍 {loc}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Auctions Grid / Clean Empty State */}
      {filteredAuctions.length === 0 ? (
        <div className="text-center py-20 bg-[#12161f] rounded-2xl border border-[#2b3547] p-8 space-y-4">
          <Gavel className="w-12 h-12 mx-auto text-amber-500/60" />
          <h3 className="font-serif text-lg font-bold text-stone-200">
            No Active Auction Lots Listed Right Now
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
            All previous example auctions have been cleared. As a registered Product Seller with verified GST, you can generate the first live auction in <strong>Antiques</strong>, <strong>Fashion</strong>, <strong>Currency</strong>, or <strong>Voiture</strong>.
          </p>
          {currentUser?.role === 'seller' ? (
            <button
              onClick={openCreateAuction}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20"
            >
              + Generate First Auction Lot
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-4 py-2 border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-black font-bold text-xs rounded-lg transition-all"
            >
              Sign In as Seller to Host an Auction
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onEnterRoom={onOpenAuction}
            />
          ))}
        </div>
      )}

      {/* Buyer Protection & Bidding Rules Box */}
      <div className="p-6 rounded-2xl bg-[#0f121a] border border-[#263142] grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-300">
        <div>
          <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 1. Anti-Sniping Protection
          </h4>
          <p className="text-stone-400 leading-relaxed">
            If a bid is registered during the final 2 minutes of an auction, the clock is automatically extended by 2 minutes, ensuring genuine fairness.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> 2. Reserve Price Dynamics
          </h4>
          <p className="text-stone-400 leading-relaxed">
            Sellers designate starting and reserve prices across Antiques, Fashion, Currency, and Voiture. If reserve is unmet, the lot remains with the curator.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> 3. Winning Settlement & Excel Sync
          </h4>
          <p className="text-stone-400 leading-relaxed">
            Winning bids automatically transition to the official sales ledger and synchronize with the downloadable Excel spreadsheet report.
          </p>
        </div>
      </div>

    </div>
  );
};
