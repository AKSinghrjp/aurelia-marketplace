import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import { AuctionCard } from '../components/AuctionCard';
import { Product, AuctionItem } from '../types';
import { 
  Gavel, 
  Store, 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  FileCheck, 
  Award, 
  FileSpreadsheet, 
  Coins, 
  Car, 
  Shirt, 
  Gem, 
  Landmark, 
  TrendingUp 
} from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  onOpenProduct: (product: Product) => void;
  onOpenAuction: (auction: AuctionItem) => void;
  openCreateAuction: () => void;
  openAuthModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onOpenProduct,
  onOpenAuction,
  openCreateAuction,
  openAuthModal,
}) => {
  const { products, auctions, exportSalesToExcel } = useMarketplace();
  const { currentUser } = useAuth();

  const liveAuctions = auctions.filter((a) => a.status === 'live');
  const spotlightAuction = liveAuctions[0] || auctions[0];
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#131720] via-[#0d1017] to-[#0a0c10] border-b border-[#2d2417] py-16 sm:py-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#c5a059]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#201910] border border-[#523e1f] text-[#d8be8d] text-xs font-semibold uppercase tracking-widest mb-6 shadow-lg shadow-[#c5a059]/10">
            <Sparkles className="w-4 h-4 text-[#c5a059]" />
            Strictly Museum-Grade Collectibles & Verified Curators
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#faf5ea] max-w-4xl mx-auto leading-[1.15]">
            Curating <span className="bg-gradient-to-r from-[#e3cda5] via-[#c5a059] to-[#99762d] bg-clip-text text-transparent">History's</span> Greatest Heirlooms.
          </h1>

          <p className="mt-6 text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Welcome to <strong>AURELIA</strong>. An exclusive online marketplace and live auction house engineered for collectors, verified galleries, and curators across <strong>Antiques</strong>, <strong>Currency</strong>, <strong>Diecast</strong>, <strong>Fashion</strong>, <strong>Luxury</strong>, and <strong>Voiture</strong>.
          </p>

          {/* Dual Action Cards */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            
            {/* Enter Live Auction Hall */}
            <div 
              onClick={() => setCurrentPage('auctions')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-[#21160a] to-[#140e06] border border-[#523e20] hover:border-amber-400 cursor-pointer transition-all hover:shadow-2xl hover:shadow-amber-500/20 text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Gavel className="w-6 h-6" />
                </div>
                <span className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  Live Floor
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                Live Auction Hall
              </h3>
              <p className="text-xs text-stone-400 mt-2">
                4 Departments: Antiques, Fashion, Currency, and Voiture. Real-time competitive bidding with anti-sniping protection.
              </p>
              <div className="mt-4 flex items-center text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform">
                Enter Auction Hall <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

            {/* Browse Direct Products Catalog */}
            <div 
              onClick={() => setCurrentPage('marketplace')}
              className="group p-6 rounded-2xl bg-gradient-to-br from-[#181d28] to-[#0f131a] border border-[#2e3b4f] hover:border-[#c5a059] cursor-pointer transition-all hover:shadow-2xl hover:shadow-[#c5a059]/20 text-left relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] group-hover:scale-110 transition-transform">
                  <Store className="w-6 h-6" />
                </div>
                <span className="text-xs text-[#c5a059] font-bold bg-[#1e1910] px-2.5 py-1 rounded-full border border-[#4a391f]">
                  Direct Buy
                </span>
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-100 group-hover:text-[#d6b77c] transition-colors">
                Product Gallery & Store
              </h3>
              <p className="text-xs text-stone-400 mt-2">
                Search, filter by 5 collector categories and location availability with instant insured cart checkout.
              </p>
              <div className="mt-4 flex items-center text-xs font-bold text-[#c5a059] group-hover:translate-x-1 transition-transform">
                Explore Catalog <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>

          </div>

          {/* Seller / Curator CTA Banner */}
          <div className="mt-8 pt-6 border-t border-[#261f14] max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <span className="flex items-center gap-1.5 text-stone-300">
              <FileCheck className="w-4 h-4 text-[#c5a059]" />
              Are you an antique merchant or certified curator with a GST number?
            </span>
            {currentUser?.role === 'seller' ? (
              <button
                onClick={openCreateAuction}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Gavel className="w-3.5 h-3.5" />
                Generate New Auction
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-3.5 py-1.5 rounded-lg border border-[#c5a059] text-[#c5a059] hover:bg-[#c5a059] hover:text-black font-semibold transition-all"
              >
                Register as GST Seller
              </button>
            )}
          </div>

        </div>
      </section>

      {/* 5 Product Sub-categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs uppercase tracking-widest text-[#c5a059] font-bold">
            Curated Collecting Fields
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100 mt-1">
            5 Distinct Product Categories
          </h2>
          <p className="text-xs text-stone-400 mt-2">
            Every item is cataloged under strict curatorial standards with documented historical provenance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: 'Antique', icon: Landmark, desc: 'Centuries-old artefacts, pottery, and furniture' },
            { name: 'Currency', icon: Coins, desc: 'Ancient gold solidi, proof sovereigns, and banknotes' },
            { name: 'Diecast', icon: Car, desc: 'Rare vintage Corgi, Dinky, and CMC precision models' },
            { name: 'Fashion', icon: Shirt, desc: 'Historic couture, silk carrés, and Art Deco jewels' },
            { name: 'Luxury', icon: Gem, desc: 'Legendary Leica cameras and chronographs' },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                onClick={() => setCurrentPage('marketplace')}
                className="p-5 rounded-2xl bg-[#12161f] border border-[#2b3648] hover:border-[#c5a059] cursor-pointer transition-all hover:scale-105 group text-center"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#1b2230] border border-[#3b4759] flex items-center justify-center text-[#c5a059] group-hover:bg-[#c5a059] group-hover:text-black transition-all mb-3">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-stone-100 group-hover:text-[#d6b77c]">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Buy-It-Now Antique Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-[#c5a059] font-bold flex items-center gap-1.5 mb-1">
              <Store className="w-4 h-4 text-[#c5a059]" />
              Standard Fixed-Price Catalog
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              Curated Lots Available for Immediate Acquisition
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('marketplace')}
            className="text-xs text-[#c5a059] hover:text-white font-bold flex items-center gap-1 self-start sm:self-auto"
          >
            Explore Entire Catalog ({products.length} lots) <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={onOpenProduct}
            />
          ))}
        </div>
      </section>

      {/* Excel Sales Reporting Highlight Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0d1811] via-[#142319] to-[#0c160f] border border-[#234d31] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold font-mono tracking-wider text-emerald-300 uppercase">
                EXCEL SALES AUDITING INTEGRATION
              </span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-stone-100">
              Real-Time Sales Report & Spreadsheet Download
            </h3>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
              Maintain complete tax, escrow, and provenance records of every lot sold on the platform—whether purchased through the direct store or won in a live auction.
            </p>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => setCurrentPage('orders')}
              className="py-2.5 px-4 rounded-xl bg-[#182a1e] border border-emerald-600/60 hover:bg-[#203628] text-emerald-300 text-xs font-semibold"
            >
              View Sales Ledger
            </button>
            <button
              onClick={exportSalesToExcel}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export to Excel (.xlsx)
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Aurelia Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="p-8 rounded-3xl bg-[#0e121a] border border-[#273244] grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-100">
              Compulsory GST Verified Sellers
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Every merchant on Aurelia must submit an active 15-digit GSTIN and verified telephone line, scrutinized by our master curatorial admin.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059]">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-100">
              Dual Commerce Model
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Experience the best of both worlds: fixed-price checkout for everyday collectibles, alongside a specialized live auction hall for premier treasures.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-100">
              Insured Escrow Custody
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Buyer funds are kept in an escrow account until white-glove delivery is completed and physical condition is verified against historical provenance documents.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
