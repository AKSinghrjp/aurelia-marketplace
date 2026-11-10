# AURELIA | Rare Antiques, Curios & Fine Art Auction House

A full-stack collector marketplace and live auction platform crafted specifically for high-value collectibles, numismatics, rare manuscripts, and historical curios.

## 🏛️ Built For Three Distinct Personas

1. **Platform Admin (Master Curator)**
   - Supervise platform listings, live auctions, customer orders, and support inquiries.
   - **Seller Verification Center**: Review registered antique sellers, audit mandatory **15-character GSTIN numbers** and **compulsory telephone numbers**, and grant or revoke listing licenses.
   - **Excel Sales Report**: Download formatted `.xlsx` workbooks containing all sold items with full GST, buyer, and seller breakdown.

2. **Product Seller (Antique Merchant / Gallery Curator)**
   - **Registration Requirements**: Basic credentials + **Compulsory 15-character GST Number** + **Compulsory Business Phone Number**.
   - **Dual Listing Capability**:
     - **Generate Live Auction**: Compulsory selection across 4 Auction Categories (**Antiques**, **Fashion**, **Currency**, **Voiture**), plus starting bid, reserve price, min increment, duration, and origin location.
     - **List Catalog Product**: Compulsory selection across 5 Product Categories (**Antique**, **Currency**, **Diecast**, **Fashion**, **Luxury**), plus price, inventory stock, condition grade, and origin location.
   - **Seller Studio Dashboard**: Track active bids received, oversee lots, and manage escrow order dispatches.

3. **Customer (Collector / Buyer)**
   - **Registration Requirements**: Full Name, Email, **Compulsory Phone Number**, and **Compulsory White-Glove Delivery Address**.
   - **Special Live Auction House**:
     - Real-time countdown timer with soft-close / anti-sniping protection.
     - 4 Dedicated Auction Categories: **Antiques**, **Fashion**, **Currency**, and **Voiture**.
     - Location filter to see where lots are available.
     - Place official bids with instant leaderboard feedback, sound & confetti celebration.
     - Interactive **"⚡ Simulate Rival Bidder"** button to experience live competitive antique bidding!
   - **Curatorial Product Gallery**:
     - Filter by 5 Product Categories: **Antique**, **Currency**, **Diecast**, **Fashion**, **Luxury**.
     - Filter by location (where available), price tiers, physical authenticity certificates, and star ratings.
     - Add to cart and proceed to secure escrow checkout.
   - **Collector Hub**: Track active contesting bids, won auctions, and orders with statutory GST receipts.
   - **Queries Desk**: Direct communication channel for provenance inquiries, delivery tracking, and disputes.

---

## 🧭 Left Scrollbar Navigation Options

1. **Profile**: Direct access to your specific persona dashboard (Admin Chamber, Seller Studio, or Collector Hub).
2. **Live Auction**: The live bidding floor with real-time timers and anti-sniping protection.
3. **Product Listing**: Full marketplace catalog across the 5 categories (Antique, Currency, Diecast, Fashion, Luxury).
4. **Orders**: Consolidated sales ledger with 1-click **Excel (.xlsx)** and **CSV** export.
5. **Queries**: Curatorial support desk to lodge and track inquiries.

---

## ⚡ Instant Demo Login Credentials

You can use the **Floating Role Demonstration Switcher** at the top of the page to switch between personas with a single click:

| Role | Name | Email | Credentials & Highlights |
|---|---|---|---|
| **Admin** | Lord Arthur Hastings | `admin@aurelia.com` | Master Overseer & GST verification authority |
| **Verified Seller** | Maharaja Antiques & Heirlooms | `seller@maharaja-antiques.com` | GSTIN: `27AAACA1234D1Z8`, Phone: `+91 98201 12345` |
| **Pending Seller** | Silk Road Rare Artifacts | `seller@silkroad.com` | GSTIN: `29BBBCB5678F1ZA`, Phone: `+91 94480 67890` (Pending admin review) |
| **Customer** | Vikramaditya Rao (Collector) | `vikram.collector@gmail.com` | Phone: `+91 98765 43210`, Address: `Indiranagar, Bengaluru` |

---

## 🚀 Running the Project

```bash
cd "C:\Users\adity\.gemini\antigravity\scratch\curio-antique-marketplace"
npm run dev
```

Open your browser to: **[http://localhost:3000](http://localhost:3000)**
