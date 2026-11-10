import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { AuctionCategory, AntiqueEra, ConditionGrade } from '../types';
import { 
  X, 
  Gavel, 
  Clock, 
  FileCheck, 
  Scroll, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Plus,
  MapPin,
  Tag 
} from 'lucide-react';

interface SellerCreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuctionCreated?: () => void;
}

const AUCTION_CATEGORIES: AuctionCategory[] = [
  'Antiques',
  'Fashion',
  'Currency',
  'Voiture',
];

export const SellerCreateAuctionModal: React.FC<SellerCreateAuctionModalProps> = ({
  isOpen,
  onClose,
  onAuctionCreated,
}) => {
  const { currentUser } = useAuth();
  const { createAuction } = useMarketplace();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AuctionCategory>('Antiques');
  const [era, setEra] = useState<AntiqueEra>('Victorian & Edwardian (1837–1910)');
  const [condition, setCondition] = useState<ConditionGrade>('Pristine / Museum Grade');
  const [startingBid, setStartingBid] = useState<number>(50000);
  const [reservePrice, setReservePrice] = useState<number>(75000);
  const [minIncrement, setMinIncrement] = useState<number>(2000);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [yearOrCentury, setYearOrCentury] = useState('Circa 1890 AD');
  const [originCountry, setOriginCountry] = useState('United Kingdom');
  const [provenance, setProvenance] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [certificateOfAuthenticity, setCertificateOfAuthenticity] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!currentUser || currentUser.role !== 'seller') {
      setErrorMessage('You must be logged in as a registered Product Seller to create an auction.');
      return;
    }

    if (!currentUser.gstNumber) {
      setErrorMessage('A verified GST Number is compulsory to generate auctions on Aurelia.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Auction lot title is required.');
      return;
    }

    // Compulsory auction category check
    if (!category) {
      setErrorMessage('It is compulsory to select one of the 4 auction categories (Antiques, Fashion, Currency, Voiture).');
      return;
    }

    // Compulsory origin / location availability check
    if (!originCountry.trim()) {
      setErrorMessage('Lot origin / availability location is compulsory for buyer reference.');
      return;
    }

    if (!provenance.trim()) {
      setErrorMessage('Historical Provenance description is required for auction cataloging.');
      return;
    }

    const now = new Date();
    const end = new Date(now.getTime() + durationHours * 3600 * 1000);

    const imagesList = imageUrl.trim()
      ? [imageUrl.trim()]
      : [
          'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&auto=format&fit=crop&q=80',
        ];

    createAuction({
      sellerId: currentUser.id,
      sellerName: currentUser.businessName || currentUser.name,
      sellerGst: currentUser.gstNumber,
      title: title.trim(),
      description: description.trim() || 'Exceptional collectors lot cataloged under curatorial standards.',
      provenance: provenance.trim(),
      category,
      era,
      condition,
      images: imagesList,
      startingBid: Number(startingBid),
      reservePrice: Number(reservePrice),
      minIncrement: Number(minIncrement),
      startTime: now.toISOString(),
      endTime: end.toISOString(),
      certificateOfAuthenticity,
      featured: true,
      yearOrCentury,
      originCountry: originCountry.trim(),
    });

    if (onAuctionCreated) onAuctionCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#12151d] border border-[#4d3a22] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#211609] via-[#332210] to-[#1c1206] p-5 border-b border-[#4d381c] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Gavel className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100">
                Generate Live Auction Lot
              </h3>
              <p className="text-[11px] text-[#d6b77c]">
                Compulsory categorization across the 4 auction categories: Antiques, Fashion, Currency, Voiture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-black/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Seller Compliance Bar */}
          <div className="p-3 rounded-xl bg-[#191d28] border border-[#2e3747] flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-400 block text-[10px]">Auction Host:</span>
              <span className="font-semibold text-stone-200">
                {currentUser?.businessName || currentUser?.name || 'Seller'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block text-[10px]">Statutory GSTIN:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {currentUser?.gstNumber || 'GST PENDING'}
              </span>
            </div>
          </div>

          {/* Lot Title */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1">
              Auction Lot Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1955 Mercedes-Benz 300 SL Classic Voiture / 1887 Victoria Proof Coin"
              className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2.5 text-xs text-stone-100 focus:border-amber-400"
              required
            />
          </div>

          {/* 4 Compulsory Auction Categories */}
          <div className="bg-[#191610] p-3.5 rounded-xl border border-[#4d381c] space-y-2">
            <label className="block text-[11px] font-bold text-amber-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                AUCTION SUBCATEGORY (COMPULSORY SELECTION) *
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Choose 1 of 4</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AUCTION_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                    category === cat
                      ? 'bg-amber-500 text-black border-amber-500 shadow-md shadow-amber-500/20 font-bold'
                      : 'bg-[#10131b] border-[#362716] text-stone-300 hover:border-amber-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Era & Where Available */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Historical Era *
              </label>
              <select
                value={era}
                onChange={(e) => setEra(e.target.value as AntiqueEra)}
                className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2.5 text-xs text-stone-100 focus:border-amber-400"
              >
                <option value="Ancient & Classical (Pre-500 AD)">Ancient & Classical (Pre-500 AD)</option>
                <option value="Medieval (500–1500 AD)">Medieval (500–1500 AD)</option>
                <option value="Renaissance & Baroque (1500–1750)">Renaissance & Baroque (1500–1750)</option>
                <option value="Victorian & Edwardian (1837–1910)">Victorian & Edwardian (1837–1910)</option>
                <option value="Art Nouveau & Art Deco (1890–1940)">Art Nouveau & Art Deco (1890–1940)</option>
                <option value="Mid-Century & Retro (1940–1980)">Mid-Century & Retro (1940–1980)</option>
                <option value="Vintage Modern (1980–2000s)">Vintage Modern (1980–2000s)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-400 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Where Available / Country of Origin (Compulsory) *
              </label>
              <input
                type="text"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                placeholder="e.g. Monaco / United Kingdom / India / France"
                className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2.5 text-xs text-stone-100 focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* Pricing Row: Starting Bid, Reserve Price, Increment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#171c26] p-3.5 rounded-xl border border-[#2f3a4b]">
            <div>
              <label className="block text-[11px] font-bold text-amber-400 mb-1">
                Starting Bid (₹) *
              </label>
              <input
                type="number"
                step={500}
                value={startingBid}
                onChange={(e) => setStartingBid(Number(e.target.value))}
                className="w-full bg-[#0d1017] border border-amber-600/40 rounded-lg p-2 text-xs font-mono font-bold text-amber-300"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-400 mb-1">
                Reserve Price (₹) *
              </label>
              <input
                type="number"
                step={500}
                value={reservePrice}
                onChange={(e) => setReservePrice(Number(e.target.value))}
                className="w-full bg-[#0d1017] border border-amber-600/40 rounded-lg p-2 text-xs font-mono font-bold text-amber-300"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-amber-400 mb-1">
                Min Increment (₹) *
              </label>
              <input
                type="number"
                step={500}
                value={minIncrement}
                onChange={(e) => setMinIncrement(Number(e.target.value))}
                className="w-full bg-[#0d1017] border border-amber-600/40 rounded-lg p-2 text-xs font-mono font-bold text-amber-300"
                required
              />
            </div>
          </div>

          {/* Auction Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Auction Duration *
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2 text-xs text-stone-100 focus:border-amber-400"
              >
                <option value={1}>1 Hour (Flash Auction)</option>
                <option value={6}>6 Hours (Evening Gala)</option>
                <option value={24}>24 Hours (1 Day)</option>
                <option value={72}>72 Hours (3 Days)</option>
                <option value={168}>7 Days (Heritage Week)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Period / Century
              </label>
              <input
                type="text"
                value={yearOrCentury}
                onChange={(e) => setYearOrCentury(e.target.value)}
                placeholder="e.g. Circa 1780 AD"
                className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2 text-xs text-stone-100"
              />
            </div>
          </div>

          {/* Historical Provenance */}
          <div>
            <label className="block text-[11px] font-bold text-[#d6b77c] mb-1 flex items-center gap-1">
              <Scroll className="w-3.5 h-3.5 text-amber-400" />
              Documented Archival Provenance (Compulsory for Auctions) *
            </label>
            <textarea
              rows={2}
              value={provenance}
              onChange={(e) => setProvenance(e.target.value)}
              placeholder="e.g. Formerly in the private collection of Sir Arthur Conan Doyle; authenticated at Christie's London in 1968."
              className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2.5 text-xs text-stone-100 focus:border-amber-400"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1">
              Image URL (Optional, curated antique default photo provided if blank)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2 text-xs text-stone-100"
            />
          </div>

          {/* Certificate Toggle */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#161a24] border border-[#2d3747]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-stone-200 font-medium">
                Include Certificate of Authenticity & Provenance Seal
              </span>
            </div>
            <input
              type="checkbox"
              checked={certificateOfAuthenticity}
              onChange={(e) => setCertificateOfAuthenticity(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-extrabold text-xs transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            <Gavel className="w-4 h-4 text-black" />
            Launch Live Auction Lot
          </button>
        </form>

      </div>
    </div>
  );
};
