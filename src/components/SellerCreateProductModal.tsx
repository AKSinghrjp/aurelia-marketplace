import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { ProductCategory, AntiqueEra, ConditionGrade } from '../types';
import { 
  X, 
  Store, 
  FileCheck, 
  Scroll, 
  ShieldCheck, 
  AlertCircle, 
  PackagePlus,
  MapPin,
  Tag 
} from 'lucide-react';

interface SellerCreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated?: () => void;
}

const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Antique',
  'Currency',
  'Diecast',
  'Fashion',
  'Luxury',
];

export const SellerCreateProductModal: React.FC<SellerCreateProductModalProps> = ({
  isOpen,
  onClose,
  onProductCreated,
}) => {
  const { currentUser } = useAuth();
  const { createProduct } = useMarketplace();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Antique');
  const [era, setEra] = useState<AntiqueEra>('Victorian & Edwardian (1837–1910)');
  const [condition, setCondition] = useState<ConditionGrade>('Excellent (Minor Natural Patina)');
  const [price, setPrice] = useState<number>(35000);
  const [originalPrice, setOriginalPrice] = useState<number>(42000);
  const [stockQuantity, setStockQuantity] = useState<number>(1);
  const [yearOrCentury, setYearOrCentury] = useState('1885 AD');
  const [originCountry, setOriginCountry] = useState('United Kingdom');
  const [dimensions, setDimensions] = useState('12cm x 8cm');
  const [weight, setWeight] = useState('350 g');
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
      setErrorMessage('You must be logged in as a registered Product Seller to list products.');
      return;
    }

    if (!currentUser.gstNumber) {
      setErrorMessage('A verified GST Number is compulsory for listing products.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Product title is required.');
      return;
    }

    // Compulsory category check
    if (!category) {
      setErrorMessage('It is compulsory to select one of the 5 specific product categories.');
      return;
    }

    // Compulsory origin / location availability check
    if (!originCountry.trim()) {
      setErrorMessage('Origin location / where the item is available is compulsory for buyer reference.');
      return;
    }

    if (!provenance.trim()) {
      setErrorMessage('Provenance history is required for all collectible items.');
      return;
    }

    const imagesList = imageUrl.trim()
      ? [imageUrl.trim()]
      : [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80',
        ];

    createProduct({
      sellerId: currentUser.id,
      sellerName: currentUser.businessName || currentUser.name,
      sellerGst: currentUser.gstNumber,
      title: title.trim(),
      description: description.trim() || 'Curated collectible antique preserved in authentic historical state.',
      provenance: provenance.trim(),
      category,
      era,
      condition,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stockQuantity: Number(stockQuantity),
      images: imagesList,
      certificateOfAuthenticity,
      yearOrCentury,
      originCountry: originCountry.trim(),
      dimensions,
      weight,
      featured: true,
    });

    if (onProductCreated) onProductCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#12151d] border border-[#3d311f] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#211910] via-[#2d2215] to-[#1a140d] p-5 border-b border-[#3b2e1a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PackagePlus className="w-5 h-5 text-[#c5a059]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100">
                List Product in Catalog
              </h3>
              <p className="text-[11px] text-[#d6b77c]">
                Compulsory categorization across the 5 official collector departments
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Seller GST Badge */}
          <div className="p-3 rounded-xl bg-[#181d27] border border-[#2e394b] flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-400 block text-[10px]">Seller Store:</span>
              <span className="font-semibold text-stone-200">
                {currentUser?.businessName || currentUser?.name || 'Seller'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-stone-400 block text-[10px]">Mandatory GSTIN:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {currentUser?.gstNumber || 'GST PENDING'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1">
              Item Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 1898 Victorian Maritime Solid Brass Sextant"
              className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#c5a059]"
              required
            />
          </div>

          {/* 5 Compulsory Product Categories Selection */}
          <div className="bg-[#171d27] p-3.5 rounded-xl border border-[#2f3a4b] space-y-2">
            <label className="block text-[11px] font-bold text-amber-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                PRODUCT SUBCATEGORY (COMPULSORY SELECTION) *
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Choose 1 of 5</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                    category === cat
                      ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-md shadow-[#c5a059]/20 font-bold'
                      : 'bg-[#10141d] border-[#2c3749] text-stone-300 hover:border-stone-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Historical Era *
              </label>
              <select
                value={era}
                onChange={(e) => setEra(e.target.value as AntiqueEra)}
                className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#c5a059]"
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
                Where Available / Origin Country (Compulsory) *
              </label>
              <input
                type="text"
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                placeholder="e.g. United Kingdom / India / France"
                className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#c5a059]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#171c26] p-3.5 rounded-xl border border-[#2f3a4b]">
            <div>
              <label className="block text-[11px] font-bold text-[#c5a059] mb-1">
                Selling Price (₹) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-[#0d1017] border border-[#c5a059]/40 rounded-lg p-2 text-xs font-mono font-bold text-stone-100"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Original Price (Strikethrough)
              </label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full bg-[#0d1017] border border-[#2e3747] rounded-lg p-2 text-xs font-mono text-stone-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-400 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                min={1}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full bg-[#0d1017] border border-emerald-600/40 rounded-lg p-2 text-xs font-mono font-bold text-emerald-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#d6b77c] mb-1 flex items-center gap-1">
              <Scroll className="w-3.5 h-3.5 text-[#c5a059]" />
              Historical Provenance Story (Origin & Authenticity History) *
            </label>
            <textarea
              rows={2}
              value={provenance}
              onChange={(e) => setProvenance(e.target.value)}
              placeholder="e.g. Acquired from the estate of Lord Hamilton, certified by Victorian Horology Guild..."
              className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#c5a059]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1">
              Description / Collector Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed physical condition, patina, hallmark stamps..."
              className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2.5 text-xs text-stone-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Period / Century
              </label>
              <input
                type="text"
                value={yearOrCentury}
                onChange={(e) => setYearOrCentury(e.target.value)}
                className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2 text-xs text-stone-100"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-stone-300 mb-1">
                Condition Grade
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ConditionGrade)}
                className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2 text-xs text-stone-100"
              >
                <option value="Pristine / Museum Grade">Pristine / Museum Grade</option>
                <option value="Mint in Original Box (MIB)">Mint in Original Box (MIB)</option>
                <option value="Excellent (Minor Natural Patina)">Excellent (Minor Natural Patina)</option>
                <option value="Good / Authentically Preserved">Good / Authentically Preserved</option>
                <option value="Restored Vintage State">Restored Vintage State</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-stone-300 mb-1">
              Image URL (Optional, curated antique photo used if blank)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-[#161a24] border border-[#303c4f] rounded-lg p-2 text-xs text-stone-100"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#b89347] hover:from-[#d4af37] hover:to-[#c5a059] text-black font-extrabold text-xs transition-all shadow-xl shadow-[#c5a059]/25 flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4 text-black" />
            Publish Product to Catalog
          </button>
        </form>

      </div>
    </div>
  );
};
