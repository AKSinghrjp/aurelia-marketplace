import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { Product } from '../types';
import { 
  X, 
  ShieldCheck, 
  FileCheck, 
  MapPin, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Truck 
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  singleBuyNowProduct?: Product | null;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  singleBuyNowProduct,
  onOrderSuccess,
}) => {
  const { currentUser } = useAuth();
  const { cart, checkout, addToCart } = useMarketplace();

  // If singleBuyNowProduct is provided, ensure it's in the checkout calculation
  const itemsToBuy = singleBuyNowProduct
    ? [{ product: singleBuyNowProduct, quantity: 1 }]
    : cart;

  const subtotal = itemsToBuy.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 50000 ? 0 : 1500;
  const grandTotal = subtotal + shipping;

  // Form states
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState(currentUser?.city || 'Bengaluru');
  const [pincode, setPincode] = useState(currentUser?.pincode || '560038');
  const [paymentMethod, setPaymentMethod] = useState('Insured Escrow Wire Transfer');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 8) {
      setErrorMessage('A valid compulsory phone number is required for dispatch & security pin.');
      return;
    }
    if (!shippingAddress.trim()) {
      setErrorMessage('A physical shipping address is required for white-glove transit.');
      return;
    }

    setIsSubmitting(true);

    // If single buy now product, make sure cart has it
    if (singleBuyNowProduct && cart.length === 0) {
      addToCart(singleBuyNowProduct, 1);
    }

    setTimeout(() => {
      const fullAddress = `${shippingAddress.trim()}, ${city.trim()} - ${pincode.trim()}`;
      const res = checkout({
        customerId: currentUser?.id || `cust-guest-${Date.now()}`,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim() || 'guest.collector@aurelia.com',
        customerPhone: customerPhone.trim(),
        shippingAddress: fullAddress,
        paymentMethod,
      });

      setIsSubmitting(false);

      if (res.success && res.orderId) {
        onOrderSuccess(res.orderId);
        onClose();
      } else {
        setErrorMessage(res.message || 'Checkout failed.');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#11141c] border border-[#3e3220] rounded-2xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#211910] via-[#2d2215] to-[#1a140d] p-5 border-b border-[#3b2e1a] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-[#c5a059]" />
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100">
                Insured Escrow Checkout
              </h3>
              <p className="text-[11px] text-[#d6b77c]">
                Compliant with Antiquities & Heirlooms Transit Protocol
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer Credentials Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d6b77c] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
              Customer Details & White-Glove Shipping
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Vikramaditya Rao"
                  className="w-full bg-[#161a24] border border-[#2e3747] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#c5a059]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                  Compulsory Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#161a24] border border-[#2e3747] rounded-lg py-2.5 pl-9 pr-3 text-xs text-stone-100 focus:border-[#c5a059]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                Email Address (for GST Tax Invoice & Authenticity Certificate) *
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="collector@gmail.com"
                className="w-full bg-[#161a24] border border-[#2e3747] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#c5a059]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                Compulsory Physical Delivery Address *
              </label>
              <textarea
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Penthouse 12B, Regency Heritage Towers, Indiranagar"
                className="w-full bg-[#161a24] border border-[#2e3747] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#c5a059]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full bg-[#161a24] border border-[#2e3747] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#c5a059]"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-300 font-semibold mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="560038"
                  className="w-full bg-[#161a24] border border-[#2e3747] rounded-lg p-2.5 text-xs text-stone-100 focus:border-[#c5a059]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2 pt-2 border-t border-[#261f15]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d6b77c] flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#c5a059]" />
              Select Settlement Mechanism
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'Insured Escrow Wire Transfer', desc: 'Protected by RBI Scheduled Bank Escrow' },
                { id: 'UPI Direct Instant Settlement', desc: 'Google Pay / PhonePe / BHIM' },
                { id: 'High-Value Metal Charge Card', desc: 'Amex Centurion / Visa Infinite' },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === m.id
                      ? 'bg-[#291f13] border-[#c5a059] text-stone-100 shadow-md shadow-[#c5a059]/10'
                      : 'bg-[#151922] border-[#293240] text-stone-400 hover:border-stone-600'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-100">{m.id}</div>
                  <div className="text-[10px] text-stone-400 mt-1">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="p-4 rounded-xl bg-[#0c0f15] border border-[#261f15] space-y-2 text-xs">
            <h5 className="font-semibold text-stone-300 text-xs mb-1">
              Acquisition Summary ({itemsToBuy.length} antique lots)
            </h5>
            {itemsToBuy.map((it) => (
              <div key={it.product.id} className="flex justify-between text-stone-400">
                <span className="truncate max-w-[260px]">
                  {it.product.title} (x{it.quantity})
                </span>
                <span className="font-mono text-stone-200">
                  ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
            <div className="pt-2 border-t border-[#222a36] flex justify-between font-bold text-sm text-stone-100">
              <span>Grand Total</span>
              <span className="text-[#c5a059] font-mono">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#c5a059] via-[#d4af37] to-[#b89347] hover:from-[#d4af37] hover:to-[#c5a059] text-black font-extrabold text-xs transition-all shadow-xl shadow-[#c5a059]/25 disabled:opacity-50"
          >
            {isSubmitting
              ? 'Securing Escrow Clearance...'
              : `Authorize Payment of ₹${grandTotal.toLocaleString('en-IN')}`}
          </button>
        </form>

      </div>
    </div>
  );
};
