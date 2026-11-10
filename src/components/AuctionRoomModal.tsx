import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  Gavel, 
  Clock, 
  TrendingUp, 
  ShieldCheck, 
  FileCheck, 
  Scroll, 
  User as UserIcon, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Crown 
} from 'lucide-react';

interface AuctionRoomModalProps {
  auction: AuctionItem | null;
  onClose: () => void;
  openAuthModal: () => void;
}

export const AuctionRoomModal: React.FC<AuctionRoomModalProps> = ({
  auction,
  onClose,
  openAuthModal,
}) => {
  const { currentUser } = useAuth();
  const { placeBid, simulateRivalBid } = useMarketplace();

  const [bidAmount, setBidAmount] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isEnded: false });

  // Update default bid amount whenever auction or currentBid updates
  useEffect(() => {
    if (auction) {
      setBidAmount(auction.currentBid + auction.minIncrement);
    }
  }, [auction?.currentBid, auction?.minIncrement]);

  // Live Countdown Timer
  useEffect(() => {
    if (!auction) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(auction.endTime).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isEnded: true });
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds, isEnded: false });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction?.endTime]);

  if (!auction) return null;

  const minNextBid = auction.currentBid + auction.minIncrement;
  const isReserveMet = auction.currentBid >= auction.reservePrice;
  const isUserLeading = currentUser && auction.highestBidderId === currentUser.id;

  const handlePlaceBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    if (!currentUser) {
      setFeedbackMessage({
        type: 'error',
        text: 'Please sign in or select a collector profile to participate in this auction.',
      });
      return;
    }

    if (currentUser.role === 'seller' && currentUser.id === auction.sellerId) {
      setFeedbackMessage({
        type: 'error',
        text: 'Sellers cannot place bids on their own auction listings.',
      });
      return;
    }

    const res = placeBid(auction.id, bidAmount, currentUser.id, currentUser.name);
    if (res.success) {
      setFeedbackMessage({ type: 'success', text: res.message });
      setBidAmount(bidAmount + auction.minIncrement);
    } else {
      setFeedbackMessage({ type: 'error', text: res.message });
    }
  };

  const handleSimulateRival = () => {
    setFeedbackMessage(null);
    const res = simulateRivalBid(auction.id);
    if (res.success && res.newBid) {
      setFeedbackMessage({
        type: 'error',
        text: `⚡ New rival bid placed by ${res.rivalName} at ₹${res.newBid.toLocaleString('en-IN')}!`,
      });
      setBidAmount(res.newBid + auction.minIncrement);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#10131a] border border-[#4a3a24] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Top Auction Live Banner */}
        <div className="bg-gradient-to-r from-[#211508] via-[#332210] to-[#1c1206] px-6 py-3 border-b border-[#4d381c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <div>
              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Gavel className="w-3.5 h-3.5 text-amber-400" />
                Live Auction Hall # {auction.id.toUpperCase()}
              </span>
              <span className="text-[11px] text-stone-400 hidden sm:inline ml-2">
                • Verified Provenance • Escrow Protected
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Countdown in Header */}
            <div className="bg-black/80 px-3 py-1 rounded-lg border border-amber-600/50 flex items-center gap-2 text-stone-200 font-mono text-xs shadow-inner">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-amber-300">
                {timeLeft.isEnded ? (
                  'AUCTION CLOSED'
                ) : (
                  `${String(timeLeft.hours).padStart(2, '0')}:${String(
                    timeLeft.minutes
                  ).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
                )}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-black/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Artifact Gallery & Provenance Details (7 cols) */}
          <div className="lg:col-span-7 p-6 bg-[#0b0e14] border-b lg:border-b-0 lg:border-r border-[#261f15] space-y-5">
            {/* Main Stage Image */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60 border border-[#302619]">
              <img
                src={auction.images[selectedImageIdx] || auction.images[0]}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded text-[11px] text-[#e0caa0] border border-[#483720]">
                {auction.yearOrCentury} • {auction.originCountry}
              </div>
              {auction.certificateOfAuthenticity && (
                <div className="absolute top-3 right-3 bg-emerald-950/90 text-emerald-300 px-2.5 py-1 rounded-full text-[10px] font-semibold border border-emerald-700/60 flex items-center gap-1 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Authenticated
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {auction.images.length > 1 && (
              <div className="flex gap-2">
                {auction.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIdx === i ? 'border-amber-400 scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Seller Info */}
            <div>
              <div className="text-xs text-[#c5a059] font-medium mb-1">
                {auction.category} • {auction.era}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100">
                {auction.title}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-stone-400">
                <span className="text-[#d8be8d] font-semibold">Seller: {auction.sellerName}</span>
                <span className="bg-[#151c27] px-2 py-0.5 rounded border border-[#2c3749] font-mono text-emerald-400 flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-emerald-400" /> GST: {auction.sellerGst}
                </span>
                <span className="bg-[#151c27] px-2 py-0.5 rounded border border-[#2c3749] text-stone-300">
                  Condition: {auction.condition}
                </span>
              </div>
            </div>

            {/* Provenance Record */}
            <div className="p-4 rounded-xl bg-[#121620] border border-[#2e2619]">
              <h4 className="text-xs font-bold text-[#d8be8d] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Scroll className="w-3.5 h-3.5 text-[#c5a059]" /> Documented Provenance Record
              </h4>
              <p className="text-xs text-stone-300 italic leading-relaxed">
                "{auction.provenance}"
              </p>
            </div>

            {/* Description */}
            <div className="text-xs text-stone-400 leading-relaxed">
              <h4 className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                Archival Lot Description
              </h4>
              <p>{auction.description}</p>
            </div>
          </div>

          {/* Right Column: Live Bidding Control & Bid History (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-[#12161f] flex flex-col justify-between space-y-6">
            
            {/* Top Status Card */}
            <div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-[#1a140d] to-[#120f09] border border-[#4a381e] shadow-xl">
                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="uppercase tracking-wider font-semibold flex items-center gap-1 text-[#d6b77c]">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    Current Winning Bid
                  </span>
                  <span className="font-mono text-[11px] text-stone-400">
                    {auction.totalBids} Total Bids
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <div className="text-3xl font-bold font-sans text-amber-400">
                    ₹{auction.currentBid.toLocaleString('en-IN')}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                    isReserveMet 
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800' 
                      : 'bg-stone-900 text-stone-400 border border-stone-800'
                  }`}>
                    {isReserveMet ? '✓ Reserve Met' : 'Reserve Active'}
                  </span>
                </div>

                {/* Highest Bidder Pill */}
                <div className="mt-3 pt-3 border-t border-[#312516] flex items-center justify-between text-xs">
                  <span className="text-stone-400">Leading Bidder:</span>
                  <span className={`font-semibold flex items-center gap-1.5 ${
                    isUserLeading ? 'text-emerald-400 font-bold' : 'text-stone-200'
                  }`}>
                    {isUserLeading && <Crown className="w-3.5 h-3.5 text-amber-400" />}
                    {auction.highestBidderName || 'None yet'}
                    {isUserLeading && ' (You!)'}
                  </span>
                </div>
              </div>

              {/* Bid Feedback alerts */}
              {feedbackMessage && (
                <div className={`mt-3 p-3 rounded-lg text-xs flex items-center gap-2 border ${
                  feedbackMessage.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-800 text-amber-200'
                }`}>
                  {feedbackMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  )}
                  <span>{feedbackMessage.text}</span>
                </div>
              )}

              {/* Bidding Control Panel */}
              {!timeLeft.isEnded ? (
                <form onSubmit={handlePlaceBidSubmit} className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-stone-200">Your Bid Amount (₹):</label>
                    <span className="text-[11px] text-amber-400 font-mono">
                      Min next: ₹{minNextBid.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-sans font-bold text-amber-400 text-sm">
                      ₹
                    </span>
                    <input
                      type="number"
                      step={1000}
                      min={minNextBid}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full bg-[#0a0d14] border border-[#3d4b60] rounded-xl py-3 pl-8 pr-4 text-base font-bold font-sans text-stone-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                      required
                    />
                  </div>

                  {/* Quick Increment Buttons */}
                  <div className="grid grid-cols-4 gap-1.5 text-xs">
                    {[1000, 2000, 5000, 10000].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => setBidAmount(auction.currentBid + inc)}
                        className="py-1.5 px-2 bg-[#19212d] hover:bg-[#253142] border border-[#2b374a] text-stone-300 rounded-lg text-center font-mono font-medium transition-all"
                      >
                        +₹{(inc / 1000)}k
                      </button>
                    ))}
                  </div>

                  {/* Main Bid Placement Action */}
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-extrabold text-sm transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
                  >
                    <Gavel className="w-4 h-4 text-black" />
                    Place Official Bid of ₹{bidAmount.toLocaleString('en-IN')}
                  </button>

                  {/* Live Simulation Testing Tool */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSimulateRival}
                      className="w-full py-2 px-3 rounded-lg bg-[#161a24] hover:bg-[#1e2433] border border-dashed border-[#445267] text-[11px] text-stone-300 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Simulate Rival Bidder Counter-Offer (Test Real-Time Heat)</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-5 p-4 rounded-xl bg-stone-900 border border-stone-800 text-center">
                  <div className="font-serif text-base font-bold text-stone-200">
                    This Auction Has Concluded
                  </div>
                  <p className="text-xs text-stone-400 mt-1">
                    Winner: <strong className="text-amber-400">{auction.highestBidderName || 'None'}</strong> for ₹{auction.currentBid.toLocaleString('en-IN')}.
                  </p>
                </div>
              )}
            </div>

            {/* Live Bid History Feed */}
            <div className="border-t border-[#261f15] pt-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                  <Scroll className="w-3.5 h-3.5 text-[#c5a059]" />
                  Live Bid Ledger ({auction.bidsHistory.length})
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono">● Real-time</span>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {auction.bidsHistory.length === 0 ? (
                  <p className="text-xs text-stone-500 italic py-2 text-center">
                    No bids recorded yet. Be the first to open the bidding!
                  </p>
                ) : (
                  auction.bidsHistory.map((bid, i) => (
                    <div
                      key={bid.id}
                      className={`p-2 rounded-lg text-xs flex items-center justify-between border ${
                        i === 0
                          ? 'bg-[#1e1910] border-amber-600/60 text-stone-100 font-semibold'
                          : 'bg-[#0f1218] border-[#222a36] text-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {i === 0 ? (
                          <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        ) : (
                          <UserIcon className="w-3 h-3 text-stone-500 flex-shrink-0" />
                        )}
                        <span className="truncate max-w-[130px]">{bid.bidderName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-stone-200">
                          ₹{bid.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-stone-500 block">
                          {new Date(bid.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
