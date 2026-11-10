import React, { useState, useMemo } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductCategory, AntiqueEra } from '../types';
import { 
  Store, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ShieldCheck, 
  ArrowUpDown, 
  Tag, 
  MapPin, 
  X, 
  Landmark, 
  Coins, 
  Car, 
  Shirt, 
  Gem 
} from 'lucide-react';

interface NormalMarketplacePageProps {
  onOpenProduct: (product: Product) => void;
}

// 5 Subcategories in Product Category
const PRODUCT_CATEGORIES: { name: ProductCategory; icon: any; desc: string }[] = [
  { name: 'Antique', icon: Landmark, desc: 'Museum relics & artefacts' },
  { name: 'Currency', icon: Coins, desc: 'Historical coins & banknotes' },
  { name: 'Diecast', icon: Car, desc: 'Precision collector scale models' },
  { name: 'Fashion', icon: Shirt, desc: 'Historic couture & heirloom jewels' },
  { name: 'Luxury', icon: Gem, desc: 'Fine horology & cameras' },
];

const ERAS: AntiqueEra[] = [
  'Ancient & Classical (Pre-500 AD)',
  'Medieval (500–1500 AD)',
  'Renaissance & Baroque (1500–1750)',
  'Victorian & Edwardian (1837–1910)',
  'Art Nouveau & Art Deco (1890–1940)',
  'Mid-Century & Retro (1940–1980)',
  'Vintage Modern (1980–2000s)',
];

export const NormalMarketplacePage: React.FC<NormalMarketplacePageProps> = ({ onOpenProduct }) => {
  const { products, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, selectedEra, setSelectedEra } = useMarketplace();

  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [onlyCertified, setOnlyCertified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract all unique locations where products are available
  const availableLocations = useMemo(() => {
    const locs = new Set<string>();
    products.forEach((p) => {
      if (p.originCountry) locs.add(p.originCountry);
    });
    return Array.from(locs);
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchProv = p.provenance.toLowerCase().includes(q);
        const matchSeller = p.sellerName.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        const matchLoc = p.originCountry.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchProv && !matchSeller && !matchCat && !matchLoc) return false;
      }

      // 5 Subcategories Check
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Location / Where Available Check
      if (selectedLocation !== 'all' && p.originCountry.toLowerCase() !== selectedLocation.toLowerCase()) {
        return false;
      }

      // Era
      if (selectedEra !== 'All' && p.era !== selectedEra) {
        return false;
      }

      // Certified Only
      if (onlyCertified && !p.certificateOfAuthenticity) {
        return false;
      }

      // Price Range
      if (priceRange === 'under-50k' && p.price > 50000) return false;
      if (priceRange === '50k-100k' && (p.price < 50000 || p.price > 100000)) return false;
      if (priceRange === '100k-250k' && (p.price < 100000 || p.price > 250000)) return false;
      if (priceRange === 'above-250k' && p.price < 250000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured default
    });
  }, [products, searchQuery, selectedCategory, selectedLocation, selectedEra, onlyCertified, priceRange, sortBy]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('all');
    setSelectedEra('All');
    setPriceRange('all');
    setOnlyCertified(false);
  };

  const isAnyFilterActive =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedLocation !== 'all' ||
    selectedEra !== 'All' ||
    priceRange !== 'all' ||
    onlyCertified;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header / Curatorial Banner */}
      <div className="bg-gradient-to-r from-[#171c26] via-[#12161f] to-[#171c26] p-6 sm:p-8 rounded-2xl border border-[#2b3648] shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a059] uppercase tracking-wider mb-1">
              <Store className="w-4 h-4 text-[#c5a059]" />
              Official Curatorial Marketplace Catalog
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
              Collectibles & Antiques Gallery
            </h1>
            <p className="text-xs text-stone-400 mt-1 max-w-2xl">
              Browse authenticated relics across 5 collector departments. Select specifically what you wish to acquire and where it is available worldwide.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-300 bg-[#0d1017] px-3.5 py-2 rounded-xl border border-[#263142]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Statutory GST Verified Sellers</span>
          </div>
        </div>

        {/* 5 Product Subcategory Cards / Pills */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`p-3 rounded-xl border text-center transition-all ${
              selectedCategory === 'All'
                ? 'bg-[#c5a059] text-black font-bold border-[#c5a059] shadow-lg shadow-[#c5a059]/20'
                : 'bg-[#151a24] border-[#293444] text-stone-300 hover:border-stone-500'
            }`}
          >
            <div className="font-bold">All Products</div>
            <div className="text-[10px] opacity-80 mt-0.5">({products.length} Lots)</div>
          </button>

          {PRODUCT_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  selectedCategory === cat.name
                    ? 'bg-[#c5a059] text-black font-bold border-[#c5a059] shadow-lg shadow-[#c5a059]/20'
                    : 'bg-[#151a24] border-[#293444] text-stone-300 hover:border-stone-500'
                }`}
              >
                <div className="flex items-center justify-center gap-1 font-bold">
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{cat.name}</span>
                </div>
                <div className="text-[10px] opacity-80 mt-0.5">({count} items)</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block space-y-6 bg-[#0f121a] p-5 rounded-2xl border border-[#242e3f] h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-[#212a3a]">
            <h3 className="font-serif text-sm font-bold text-stone-200 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#c5a059]" />
              Filter Catalog
            </h3>
            {isAnyFilterActive && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#c5a059] hover:underline"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Location / Where Available Filter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Where Available (Location)
            </h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedLocation('all')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  selectedLocation === 'all' ? 'bg-[#291f13] text-amber-300 font-semibold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                All Worldwide Locations
              </button>
              {availableLocations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(loc)}
                  className={`w-full text-left px-2 py-1 rounded transition-colors truncate ${
                    selectedLocation.toLowerCase() === loc.toLowerCase()
                      ? 'bg-[#291f13] text-amber-300 font-semibold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  📍 {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Historical Era Filter */}
          <div className="pt-3 border-t border-[#212a3a]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Historical Era
            </h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => setSelectedEra('All')}
                className={`w-full text-left px-2 py-1 rounded transition-colors ${
                  selectedEra === 'All' ? 'bg-[#251e13] text-[#f0d49f] font-semibold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                All Eras
              </button>
              {ERAS.map((era) => (
                <button
                  key={era}
                  onClick={() => setSelectedEra(era)}
                  className={`w-full text-left px-2 py-1 rounded transition-colors truncate ${
                    selectedEra === era ? 'bg-[#251e13] text-[#f0d49f] font-semibold' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {era}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-3 border-t border-[#212a3a]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
              Price Range
            </h4>
            <div className="space-y-1.5 text-xs">
              {[
                { id: 'all', label: 'All Price Tiers' },
                { id: 'under-50k', label: 'Under ₹50,000' },
                { id: '50k-100k', label: '₹50,000 to ₹1,00,000' },
                { id: '100k-250k', label: '₹1,00,000 to ₹2,50,000' },
                { id: 'above-250k', label: 'Above ₹2,50,000 (Museum Tier)' },
              ].map((tier) => (
                <label
                  key={tier.id}
                  className="flex items-center gap-2 cursor-pointer text-stone-300 hover:text-white"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === tier.id}
                    onChange={() => setPriceRange(tier.id)}
                    className="accent-[#c5a059]"
                  />
                  <span>{tier.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Certification Checkbox */}
          <div className="pt-3 border-t border-[#212a3a]">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300 hover:text-white">
              <input
                type="checkbox"
                checked={onlyCertified}
                onChange={(e) => setOnlyCertified(e.target.checked)}
                className="w-4 h-4 accent-[#c5a059] rounded"
              />
              <span className="font-medium text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Physical Certificate Included
              </span>
            </label>
          </div>
        </aside>

        {/* Right Content Area: Sort Bar + Products Grid */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Subheader Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#131720] px-4 py-3 rounded-xl border border-[#273243] text-xs">
            <div className="text-stone-300 font-medium">
              Showing <strong className="text-[#c5a059]">{filteredProducts.length}</strong> items
              {selectedCategory !== 'All' && <span> in <strong className="text-white">{selectedCategory}</strong></span>}
              {selectedLocation !== 'all' && <span> available in <strong className="text-amber-400">{selectedLocation}</strong></span>}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-stone-400 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#1c222e] border border-[#344155] rounded-lg px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Collector Rating</option>
                </select>
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden p-1.5 rounded-lg bg-[#1e2533] border border-[#324054] text-stone-300"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Filter Tags */}
          {isAnyFilterActive && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-stone-400 text-[11px]">Applied Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="bg-[#241d14] text-[#d6b77c] px-2.5 py-0.5 rounded-full border border-[#4d3a24] flex items-center gap-1">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="bg-[#241d14] text-amber-300 px-2.5 py-0.5 rounded-full border border-[#4d3a24] flex items-center gap-1">
                  Location: {selectedLocation}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedLocation('all')} />
                </span>
              )}
              {selectedEra !== 'All' && (
                <span className="bg-[#241d14] text-[#d6b77c] px-2.5 py-0.5 rounded-full border border-[#4d3a24] flex items-center gap-1">
                  Era: {selectedEra}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedEra('All')} />
                </span>
              )}
              {priceRange !== 'all' && (
                <span className="bg-[#241d14] text-[#d6b77c] px-2.5 py-0.5 rounded-full border border-[#4d3a24] flex items-center gap-1">
                  Price: {priceRange}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setPriceRange('all')} />
                </span>
              )}
              {onlyCertified && (
                <span className="bg-emerald-950/60 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
                  Certified Only
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setOnlyCertified(false)} />
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-stone-400 hover:text-white underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-[#0f121a] rounded-2xl border border-[#242e3f] p-8 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#161a22] border border-[#2e3747] flex items-center justify-center text-stone-500">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-200">
                No items match your selected criteria
              </h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try switching between Antique, Currency, Diecast, Fashion, or Luxury subcategories, or change your location filter.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[#c5a059] text-black font-bold text-xs rounded-lg shadow-lg shadow-[#c5a059]/20"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={onOpenProduct}
                />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
