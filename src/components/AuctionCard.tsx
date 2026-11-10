import React, { useState, useEffect } from 'react';
import { AuctionItem } from '../types';
import { 
  Gavel, 
  Clock, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  User as UserIcon, 
  FileCheck 
} from 'lucide-react';

interface AuctionCardProps {
  auction: AuctionItem;
  onEnterRoom: (auction: AuctionItem) => void;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ auction, onEnterRoom }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isEnded: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isEnded: false });

  useEffect(() => {
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
  }, [auction.endTime]);

  const isReserveMet = auction.currentBid >= auction.reservePrice;

  return (
    <div className="group relative bg-[#131720] border border-[#382b1c] rounded-xl overflow-hidden hover:border-amber-500/80 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between">
      
      {/* Imagery with Live Badge & Timer */}
      <div 
        onClick={() => onEnterRoom(auction)}
        className="relative aspect-[16/10] overflow-hidden bg-black/50 cursor-pointer"
      >
        <img
          src={auction.images[0]}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#131720] via-transparent to-black/40" />

        {/* Live Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {timeLeft.isEnded ? (
            <span className="bg-red-950/90 text-red-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-800 backdrop-blur-md">
              AUCTION CONCLUDED
            </span>
          ) : (
            <span className="bg-amber-950/90 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-600/80 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              LIVE AUCTION
            </span>
          )}
        </div>

        {/* Countdown Floating Box */}
        <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-[#3f321d] text-stone-200 text-xs font-mono flex items-center gap-1.5 shadow-lg">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {timeLeft.isEnded ? (
              'Closed'
            ) : (
              `${String(timeLeft.hours).padStart(2, '0')}:${String(
                timeLeft.minutes
              ).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`
            )}
          </span>
        </div>

        {/* Era Tag */}
        <div className="absolute bottom-2.5 left-3 text-[10px] text-[#e3cda5] bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded border border-stone-700">
          {auction.era}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller & GST Header */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
            <span className="text-amber-400 font-medium truncate max-w-[150px]">
              {auction.sellerName}
            </span>
            <span className="text-[10px] font-mono text-stone-400 bg-[#1b222e] px-1.5 py-0.5 rounded border border-[#2b3547]">
              GST: {auction.sellerGst.slice(0, 7)}...
            </span>
          </div>

          <h3 
            onClick={() => onEnterRoom(auction)}
            className="font-serif text-sm font-bold text-stone-100 hover:text-amber-300 cursor-pointer line-clamp-2 transition-colors"
          >
            {auction.title}
          </h3>

          <p className="text-[11px] text-stone-400 mt-2 line-clamp-2 italic">
            "{auction.provenance}"
          </p>
        </div>

        {/* Bidding Summary Box */}
        <div className="mt-4 pt-3 border-t border-[#2a2216]">
          <div className="bg-[#0b0e14] p-3 rounded-xl border border-[#222a36] mb-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-stone-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-amber-400" /> Current Leading Bid
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                {auction.totalBids} bids placed
              </span>
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className="text-lg font-bold font-sans text-amber-400">
                ₹{auction.currentBid.toLocaleString('en-IN')}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                isReserveMet 
                  ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-900' 
                  : 'bg-stone-900 text-stone-400 border border-stone-800'
              }`}>
                {isReserveMet ? 'Reserve Met' : 'Reserve In Effect'}
              </span>
            </div>

            {auction.highestBidderName && (
              <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                <UserIcon className="w-2.5 h-2.5 text-[#c5a059]" />
                <span className="truncate">Top Bidder: {auction.highestBidderName}</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onEnterRoom(auction)}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <Gavel className="w-4 h-4 text-black" />
            Enter Live Auction Room
          </button>
        </div>

      </div>

    </div>
  );
};
