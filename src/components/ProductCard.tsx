import React from 'react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  ShieldCheck, 
  ShoppingBag, 
  Star, 
  MapPin, 
  FileCheck, 
  Clock, 
  Eye,
  Tag 
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetails }) => {
  const { addToCart } = useMarketplace();

  return (
    <div className="group relative bg-[#13171f] border border-[#2b2216] rounded-xl overflow-hidden hover:border-[#c5a059]/70 hover:shadow-2xl hover:shadow-[#c5a059]/10 transition-all duration-300 flex flex-col justify-between">
      
      {/* Image & Badge Container */}
      <div 
        onClick={() => onOpenDetails(product)}
        className="relative aspect-[4/3] overflow-hidden bg-black/40 cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#13171f] via-transparent to-black/30" />

        {/* Category Pill (Antique / Currency / Diecast / Fashion / Luxury) */}
        <span className="absolute top-2.5 left-2.5 bg-[#0e1218]/95 backdrop-blur-md text-[#d8be8d] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#c5a059]/40 shadow-md">
          {product.category}
        </span>

        {/* Certificate Badge */}
        {product.certificateOfAuthenticity && (
          <span className="absolute top-2.5 right-2.5 bg-emerald-950/90 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-700/60 flex items-center gap-1 backdrop-blur-md shadow-md">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Certified
          </span>
        )}

        {/* Location Availability Badge */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-stone-300 flex items-center gap-1 border border-stone-800">
          <MapPin className="w-2.5 h-2.5 text-[#c5a059]" />
          <span>Available: {product.originCountry}</span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <span className="px-3.5 py-1.5 rounded-full bg-[#1e1710] border border-[#c5a059] text-xs font-semibold text-[#f5ecd7] flex items-center gap-1.5 shadow-xl">
            <Eye className="w-3.5 h-3.5 text-[#c5a059]" /> Inspect Provenance
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Seller & GST info badge */}
          <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1.5">
            <span className="truncate max-w-[140px] text-[#c5a059] font-medium">
              {product.sellerName}
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] text-stone-400 bg-[#1a212d] px-1.5 py-0.5 rounded border border-[#2b3648]">
              <FileCheck className="w-2.5 h-2.5 text-emerald-400" />
              GST: {product.sellerGst.slice(0, 7)}...
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onOpenDetails(product)}
            className="font-serif text-sm font-semibold text-stone-100 hover:text-[#d6b77c] cursor-pointer line-clamp-2 transition-colors"
          >
            {product.title}
          </h3>

          {/* Era & Rating */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-[10px] text-stone-400 truncate max-w-[150px]">
              {product.era.split('(')[0]}
            </span>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-stone-300">{product.rating}</span>
            </div>
          </div>

          {/* Provenance Snippet */}
          <p className="text-[11px] text-stone-400 mt-2 line-clamp-2 italic bg-[#0d1016] p-2 rounded border border-[#1f2633]">
            "{product.provenance}"
          </p>
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-3 mt-3 border-t border-[#221c13]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Acquisition Price</div>
              <div className="flex items-baseline gap-2">
                <span className="text-base font-bold font-sans text-stone-100">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-xs text-stone-500 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            <span className="text-[10px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900/60">
              Stock: {product.stockQuantity}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenDetails(product)}
              className="py-1.5 px-3 rounded-lg border border-[#3b3020] bg-[#161a22] hover:bg-[#202633] text-stone-200 text-xs font-medium transition-all"
            >
              Details
            </button>
            <button
              onClick={() => addToCart(product, 1)}
              className="py-1.5 px-3 rounded-lg bg-gradient-to-r from-[#c5a059] to-[#b89347] hover:from-[#d4af37] hover:to-[#c5a059] text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#c5a059]/10"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
