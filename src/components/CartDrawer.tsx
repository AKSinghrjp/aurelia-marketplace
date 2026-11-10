import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  Minus, 
  FileCheck 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const { cart, removeFromCart, updateCartQuantity } = useMarketplace();

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 1500;
  const grandTotal = subtotal + shipping;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#10131a] border-l border-[#3a2e1d] h-full flex flex-col justify-between text-stone-200 shadow-2xl">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#1c160f] to-[#120f09] border-b border-[#362917] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#c5a059]" />
            <h3 className="font-serif text-lg font-bold text-stone-100">
              Collector Acquisition Cart
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-black/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#161a22] border border-[#2e3747] flex items-center justify-center text-stone-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-base text-stone-300">Your acquisition cart is empty</h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our catalog of certified numismatics, horology, and museum-grade antiques.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="p-3.5 rounded-xl bg-[#151922] border border-[#283242] flex gap-3.5 relative"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 rounded-lg object-cover bg-black/40 flex-shrink-0 border border-[#3b4759]"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#c5a059] font-medium block">
                      {item.product.era.split('(')[0]}
                    </span>
                    <h4 className="text-xs font-semibold text-stone-200 line-clamp-1">
                      {item.product.title}
                    </h4>
                    <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">
                      Seller GST: {item.product.sellerGst}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-bold font-sans text-stone-100">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    <div className="flex items-center gap-1.5 bg-[#0e1117] px-2 py-0.5 rounded-lg border border-[#273140]">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="text-stone-400 hover:text-white p-0.5"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="text-stone-400 hover:text-white p-0.5"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-5 bg-[#0b0e14] border-t border-[#292015] space-y-3">
            <div className="space-y-1.5 text-xs text-stone-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-sans font-medium text-stone-200">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Insured White-Glove Transit</span>
                <span className="text-emerald-400 font-medium">
                  {shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping.toLocaleString('en-IN')}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Statutory GST Invoice</span>
                <span className="text-stone-300 font-mono text-[11px]">Included (B2C / B2B)</span>
              </div>
              <div className="pt-2 border-t border-[#202733] flex justify-between text-sm font-bold text-stone-100">
                <span>Grand Total</span>
                <span className="font-sans text-base text-[#c5a059]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#141922] border border-[#2b3547] text-[11px] text-stone-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Funds held securely in Escrow until physical delivery inspection.</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#b89347] hover:from-[#d4af37] hover:to-[#c5a059] text-black font-extrabold text-xs transition-all shadow-xl shadow-[#c5a059]/20 flex items-center justify-center gap-2"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
