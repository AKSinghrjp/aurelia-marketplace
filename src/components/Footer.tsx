import React from 'react';
import { Crown, Shield, FileCheck, Award, HeartHandshake, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#090b0e] border-t border-[#2a2216] text-stone-300 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-[#211a11]">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#18130c] border border-[#3f311c] text-[#c5a059]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Mandatory GST Verification</h4>
              <p className="text-xs text-stone-400 mt-1">
                Every antique product seller undergoes statutory GSTIN registration verification before listing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#18130c] border border-[#3f311c] text-[#c5a059]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Certified Provenance</h4>
              <p className="text-xs text-stone-400 mt-1">
                Every artifact carries detailed historical provenance records and certificates of authenticity.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#18130c] border border-[#3f311c] text-[#c5a059]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">Escrow Protected Bidding</h4>
              <p className="text-xs text-stone-400 mt-1">
                Auction bids and buy-it-now purchases are safeguarded via insured custodial bank settlement.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-[#18130c] border border-[#3f311c] text-[#c5a059]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-100">White-Glove Delivery</h4>
              <p className="text-xs text-stone-400 mt-1">
                Specialized climate-controlled and armored transit for high-value antique heirlooms.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 border-b border-[#211a11]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-[#c5a059]" />
              <span className="font-serif tracking-widest text-xl font-bold text-[#f5ebd2]">AURELIA</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              India's premier digital marketplace and live auction hall dedicated strictly to museum-grade antiques, rare numismatics, heirloom jewelry, and historical curios.
            </p>
            <div className="text-[11px] text-[#c5a059] font-mono">
              Statutory Platform Compliance • GST Rule 8(1)
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#d5ba80] mb-4">Marketplace</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="hover:text-stone-200 cursor-pointer">All Antique Departments</li>
              <li className="hover:text-stone-200 cursor-pointer">Live Auction Hall</li>
              <li className="hover:text-stone-200 cursor-pointer">Rare Numismatics & Coins</li>
              <li className="hover:text-stone-200 cursor-pointer">Horology & Chronographs</li>
              <li className="hover:text-stone-200 cursor-pointer">Illuminated Manuscripts</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#d5ba80] mb-4">For Sellers & Curators</h5>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="hover:text-stone-200 cursor-pointer">Seller Onboarding & GST Rules</li>
              <li className="hover:text-stone-200 cursor-pointer">How to Host a Timed Auction</li>
              <li className="hover:text-stone-200 cursor-pointer">Provenance Authentication Guild</li>
              <li className="hover:text-stone-200 cursor-pointer">Appraisal Standards</li>
              <li className="hover:text-stone-200 cursor-pointer">Seller Studio Access</li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold uppercase tracking-wider text-[#d5ba80] mb-4">Contact & Concierge</h5>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> Curatorial Chambers, Fort, Mumbai
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#c5a059]" /> +91 (022) 2284-9000
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#c5a059]" /> concierge@aurelia-antiques.com
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>© 2026 AURELIA Antiques & Auctions Ltd. All Rights Reserved.</p>
          <div className="flex gap-6">
            <span className="hover:text-stone-300 cursor-pointer">Auction Terms & Bid Conditions</span>
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-300 cursor-pointer">GST Compliance Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
