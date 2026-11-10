import React, { useState } from 'react';
import { Product } from '../types';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  ShieldCheck, 
  ShoppingBag, 
  Star, 
  MapPin, 
  FileCheck, 
  Clock, 
  Scroll, 
  Building2, 
  Truck, 
  CheckCircle2 
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow,
}) => {
  const { addToCart } = useMarketplace();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#11141b] border border-[#3d311f] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-stone-300 hover:text-white hover:bg-black/90 transition-all border border-stone-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Imagery */}
          <div className="p-6 bg-[#0a0d12] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#261f14]">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-black/50 border border-[#2e261a]">
                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[#d6b77c] text-xs font-semibold px-3 py-1 rounded-full border border-[#c5a059]/40">
                  {product.yearOrCentury}
                </span>
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-[#c5a059] scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Seller Compliance Seal */}
            <div className="mt-6 p-4 rounded-xl bg-[#141822] border border-[#2b3547]">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-200">
                <Building2 className="w-4 h-4 text-[#c5a059]" />
                <span>Verified Antique Curatorship</span>
              </div>
              <p className="text-xs text-[#d6b77c] font-medium mt-1">
                {product.sellerName}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                <span className="bg-[#0f141d] px-2 py-0.5 rounded border border-[#344055] font-mono text-emerald-400 flex items-center gap-1">
                  <FileCheck className="w-3 h-3 text-emerald-400" /> GSTIN: {product.sellerGst}
                </span>
                <span className="bg-[#0f141d] px-2 py-0.5 rounded border border-[#344055] text-stone-400">
                  Origin: {product.originCountry}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Antiquarian Details & Actions */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Era */}
              <div className="flex items-center gap-2 text-xs text-[#c5a059] mb-2 font-medium">
                <span>{product.category}</span>
                <span>•</span>
                <span>{product.era}</span>
              </div>

              <h2 className="font-serif text-2xl font-bold text-stone-100 leading-tight">
                {product.title}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-3 text-sm">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-stone-200">{product.rating}</span>
                <span className="text-xs text-stone-400">({product.reviewsCount} collector reviews)</span>
              </div>

              {/* Pricing Box */}
              <div className="mt-5 p-4 rounded-xl bg-[#171b24] border border-[#312617] flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-stone-400 uppercase tracking-wider block">Price (Inclusive of GST & Escrow)</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-stone-100 font-sans">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-stone-500 line-through">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800">
                    {product.stockQuantity > 0 ? `${product.stockQuantity} In Stock` : 'Sold Out'}
                  </span>
                </div>
              </div>

              {/* Provenance Record (Crucial for collectors!) */}
              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-[#d6b77c] uppercase tracking-wider mb-2">
                  <Scroll className="w-4 h-4 text-[#c5a059]" />
                  Documented Archival Provenance
                </div>
                <div className="p-3.5 rounded-xl bg-[#0f1218] border border-[#2a2216] text-xs text-stone-300 leading-relaxed italic">
                  "{product.provenance}"
                </div>
              </div>

              {/* Physical Specifications */}
              <div className="mt-6">
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Antique Specifications
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#161a22] border border-[#252e3d]">
                    <span className="text-stone-500 block text-[10px]">Condition Grade</span>
                    <span className="font-medium text-stone-200">{product.condition}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#161a22] border border-[#252e3d]">
                    <span className="text-stone-500 block text-[10px]">Authenticity Guarantee</span>
                    <span className="font-medium text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certified
                    </span>
                  </div>
                  {product.dimensions && (
                    <div className="p-2.5 rounded-lg bg-[#161a22] border border-[#252e3d]">
                      <span className="text-stone-500 block text-[10px]">Dimensions</span>
                      <span className="font-medium text-stone-200">{product.dimensions}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="p-2.5 rounded-lg bg-[#161a22] border border-[#252e3d]">
                      <span className="text-stone-500 block text-[10px]">Weight</span>
                      <span className="font-medium text-stone-200">{product.weight}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Full Description */}
              <div className="mt-6 text-xs text-stone-300 leading-relaxed">
                <h4 className="font-bold text-stone-400 uppercase tracking-wider mb-2 text-xs">
                  Curator's Note
                </h4>
                <p className="text-stone-400">{product.description}</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-4 border-t border-[#2a2216] flex gap-3">
              <button
                onClick={() => {
                  addToCart(product, 1);
                }}
                className="flex-1 py-3 px-4 rounded-xl border border-[#c5a059] bg-[#1a150e] hover:bg-[#2a2013] text-[#f5ecd7] text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#c5a059]" />
                Add to Cart
              </button>
              <button
                onClick={() => {
                  onBuyNow(product);
                  onClose();
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#b89347] hover:from-[#d4af37] hover:to-[#c5a059] text-black text-xs font-bold transition-all shadow-xl shadow-[#c5a059]/20"
              >
                Buy Now (Instant Checkout)
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
