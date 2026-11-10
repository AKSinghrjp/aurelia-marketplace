import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { Navbar } from './components/Navbar';
import { LeftSidebar } from './components/LeftSidebar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AuctionRoomModal } from './components/AuctionRoomModal';
import { SellerCreateAuctionModal } from './components/SellerCreateAuctionModal';
import { SellerCreateProductModal } from './components/SellerCreateProductModal';

// Pages
import { HomePage } from './pages/HomePage';
import { NormalMarketplacePage } from './pages/NormalMarketplacePage';
import { AuctionHousePage } from './pages/AuctionHousePage';
import { OrdersLedgerPage } from './pages/OrdersLedgerPage';
import { QueriesPage } from './pages/QueriesPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';

import { Product, AuctionItem } from './types';
import { CheckCircle2, Crown, Sparkles, X, ShieldAlert, Building2, User as UserIcon } from 'lucide-react';

const MainApp: React.FC = () => {
  const { currentUser, switchUser } = useAuth();
  const {
    activeProductModal,
    setActiveProductModal,
    activeAuctionModal,
    setActiveAuctionModal,
  } = useMarketplace();

  // Navigation state: 'home' | 'marketplace' | 'auctions' | 'orders' | 'queries' | 'seller' | 'admin' | 'customer'
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [singleBuyNowProduct, setSingleBuyNowProduct] = useState<Product | null>(null);
  const [isCreateAuctionOpen, setIsCreateAuctionOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  const handleOpenProduct = (prod: Product) => {
    setActiveProductModal(prod);
  };

  const handleOpenAuction = (auc: AuctionItem) => {
    setActiveAuctionModal(auc);
  };

  const handleBuyNow = (prod: Product) => {
    setSingleBuyNowProduct(prod);
    setIsCheckoutModalOpen(true);
  };

  const handleProceedToCheckoutFromCart = () => {
    setSingleBuyNowProduct(null);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0d12] text-stone-200">
      
      {/* Universal Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          setIsSidebarOpenMobile(false);
        }}
        openAuthModal={() => setIsAuthModalOpen(true)}
        openCartDrawer={() => setIsCartDrawerOpen(true)}
        toggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
      />

      {/* Floating Demo Role Switcher Bar */}
      <div className="bg-[#121620] border-b border-[#2b3548] py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#c5a059] uppercase tracking-wider flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Role Demonstration Switcher:
            </span>
            <span className="text-stone-400 hidden sm:inline text-[11px]">
              (Switch between Admin, GST Verified Seller, Pending Seller, and Collector)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => { switchUser('user-admin-1'); setCurrentPage('admin'); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                currentUser?.role === 'admin'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500 font-bold'
                  : 'bg-[#1b2230] text-stone-300 hover:bg-[#252f42]'
              }`}
            >
              <ShieldAlert className="w-3 h-3 text-emerald-400" /> 1. Admin Portal
            </button>

            <button
              onClick={() => { switchUser('user-seller-1'); setCurrentPage('seller'); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                currentUser?.id === 'user-seller-1'
                  ? 'bg-amber-950 text-amber-300 border border-amber-500 font-bold'
                  : 'bg-[#1b2230] text-stone-300 hover:bg-[#252f42]'
              }`}
            >
              <Building2 className="w-3 h-3 text-amber-400" /> 2. Product Seller (Verified GST)
            </button>

            <button
              onClick={() => { switchUser('user-seller-2'); setCurrentPage('seller'); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                currentUser?.id === 'user-seller-2'
                  ? 'bg-orange-950 text-orange-300 border border-orange-500 font-bold'
                  : 'bg-[#1b2230] text-stone-300 hover:bg-[#252f42]'
              }`}
            >
              <Building2 className="w-3 h-3 text-orange-400" /> Pending Seller (Pending GST)
            </button>

            <button
              onClick={() => { switchUser('user-customer-1'); setCurrentPage('customer'); }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                currentUser?.role === 'customer'
                  ? 'bg-sky-950 text-sky-300 border border-sky-500 font-bold'
                  : 'bg-[#1b2230] text-stone-300 hover:bg-[#252f42]'
              }`}
            >
              <UserIcon className="w-3 h-3 text-sky-400" /> 3. Customer / Collector
            </button>
          </div>
        </div>
      </div>

      {/* Main Body with Left Scrollbar Navigation */}
      <div className="flex-1 flex w-full">
        
        {/* Left Scrollbar Navigation Component (Desktop persistent, Mobile drawer) */}
        <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpenMobile ? 'translate-x-0 top-20' : '-translate-x-full md:translate-x-0'
        }`}>
          <LeftSidebar
            currentPage={currentPage}
            setCurrentPage={(page) => {
              setCurrentPage(page);
              setIsSidebarOpenMobile(false);
            }}
            openCreateAuction={() => setIsCreateAuctionOpen(true)}
            openCreateProduct={() => setIsCreateProductOpen(true)}
          />
        </div>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpenMobile && (
          <div
            onClick={() => setIsSidebarOpenMobile(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 md:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          {currentPage === 'home' && (
            <HomePage
              setCurrentPage={setCurrentPage}
              onOpenProduct={handleOpenProduct}
              onOpenAuction={handleOpenAuction}
              openCreateAuction={() => setIsCreateAuctionOpen(true)}
              openAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}

          {currentPage === 'marketplace' && (
            <NormalMarketplacePage onOpenProduct={handleOpenProduct} />
          )}

          {currentPage === 'auctions' && (
            <AuctionHousePage
              onOpenAuction={handleOpenAuction}
              openCreateAuction={() => setIsCreateAuctionOpen(true)}
              openAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}

          {/* Dedicated Orders & Excel Sales Ledger Page */}
          {currentPage === 'orders' && (
            <OrdersLedgerPage />
          )}

          {/* Dedicated Queries & Support Page */}
          {currentPage === 'queries' && (
            <QueriesPage />
          )}

          {currentPage === 'seller' && (
            <SellerDashboardPage
              openCreateAuction={() => setIsCreateAuctionOpen(true)}
              openCreateProduct={() => setIsCreateProductOpen(true)}
              onOpenProduct={handleOpenProduct}
              onOpenAuction={handleOpenAuction}
            />
          )}

          {currentPage === 'admin' && (
            <AdminDashboardPage
              onOpenProduct={handleOpenProduct}
              onOpenAuction={handleOpenAuction}
            />
          )}

          {currentPage === 'customer' && (
            <CustomerDashboardPage
              setCurrentPage={setCurrentPage}
              onOpenAuction={handleOpenAuction}
              onOpenProduct={handleOpenProduct}
            />
          )}

          {/* Universal Footer */}
          <Footer />
        </main>
      </div>

      {/* MODALS */}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onProceedToCheckout={handleProceedToCheckoutFromCart}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => {
          setIsCheckoutModalOpen(false);
          setSingleBuyNowProduct(null);
        }}
        singleBuyNowProduct={singleBuyNowProduct}
        onOrderSuccess={(orderId) => setOrderSuccessId(orderId)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onBuyNow={handleBuyNow}
      />

      {/* Auction Room Modal */}
      <AuctionRoomModal
        auction={activeAuctionModal}
        onClose={() => setActiveAuctionModal(null)}
        openAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Seller Create Auction Modal */}
      <SellerCreateAuctionModal
        isOpen={isCreateAuctionOpen}
        onClose={() => setIsCreateAuctionOpen(false)}
        onAuctionCreated={() => setCurrentPage('auctions')}
      />

      {/* Seller Create Product Modal */}
      <SellerCreateProductModal
        isOpen={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        onProductCreated={() => setCurrentPage('marketplace')}
      />

      {/* Order Confirmation Dialog */}
      {orderSuccessId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-md w-full bg-[#11141c] border border-emerald-500/50 rounded-2xl p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setOrderSuccessId(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/60 border border-emerald-500/60 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="font-serif text-xl font-bold text-stone-100">
              Acquisition Confirmed!
            </h3>

            <p className="text-xs text-stone-300 mt-2 leading-relaxed">
              Your acquisition has been safely recorded in the Aurelia Escrow Ledger and synced with the Excel sales spreadsheet:
            </p>

            <div className="mt-3 p-3 rounded-lg bg-[#0c0f16] border border-[#232d3d] font-mono text-sm font-bold text-amber-400">
              #{orderSuccessId}
            </div>

            <p className="text-[11px] text-stone-400 mt-3">
              A statutory GST invoice and certificate of authenticity have been issued.
            </p>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => {
                  setOrderSuccessId(null);
                  setCurrentPage('orders');
                }}
                className="flex-1 py-2.5 rounded-lg bg-[#191f2b] border border-[#37455a] text-stone-200 text-xs font-semibold hover:bg-[#252f42]"
              >
                View in Sales Ledger
              </button>
              <button
                onClick={() => setOrderSuccessId(null)}
                className="flex-1 py-2.5 rounded-lg bg-[#c5a059] text-black font-bold text-xs hover:bg-[#d4af37]"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <MainApp />
      </MarketplaceProvider>
    </AuthProvider>
  );
}

export default App;
