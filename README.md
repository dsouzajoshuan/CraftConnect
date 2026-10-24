# CraftConnect 🌿
> **“Speak. Create. Sell. Preserve the craft.”**

A modern, voice-first digital marketplace crafted specifically for traditional artisans from coastal Karnataka (Udupi, Kumta, Mangaluru, Sirsi) to sell their handmade treasures online without requiring advanced digital literacy.

---

## 🌟 Vision & Key Highlights

Traditional craftspeople—such as Kasuti embroidery masters, Beedu basket weavers, terracotta sculptors, and handmade jewelry creators—often face digital barriers in traditional e-commerce platforms. CraftConnect eliminates these barriers with a voice-first design:

- **🎙️ Speak & Sell (Voice Listing)**: Artisans simply record a voice note in **Kannada (ಕನ್ನಡ)**, **Hindi**, or **English** describing their product. Built-in Web Speech API integration captures and organizes product details automatically.
- **✨ AI Description Polishing**: Demo AI assistant refines spoken transcripts into professional, SEO-friendly marketplace descriptions.
- **📊 Artisan Business Dashboard**: Clean visual analytics with interactive sales charts (powered by Recharts), quick inventory stats, and instant order tracking.
- **🤝 Craft Circle (Community Hub)**: Artisan peer-to-peer learning network with video tutorials, workshop registrations (e.g. Live Kasuti embroidery sessions), and community Q&A.
- **💬 WhatsApp Support & Voice Help**: Dedicated help center featuring browser audio narration for non-literate users and a simulated direct WhatsApp coordinator chat.
- **🛍️ Buyer Marketplace**: High-conversion buyer storefront with category filters, search, price ranges, product inspection zoom, wishlists, and demo checkout.

---

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom coastal heritage palette (`forest`, `deep-green`, `terracotta`, `cream`, `sand`, `sage`)
- **Typography**: Playfair Display (Serif headings) + Inter (Clean sans body)
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **State & Storage**: React Context + LocalStorage persistence for demo carts, wishlist, orders, and products
- **Speech Integration**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd CraftConnect
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🧭 Pages & Application Routes

### Public Experience
- `/`: **Homepage** with hero, craft heritage spotlight, voice listing preview, featured products, artisan stories, and cultural mission.
- `/marketplace`: **Explore Crafts** with keyword search, category filter chips, price range sliders, and sorting.
- `/product/:id`: **Product Details** with multi-image gallery, artisan bio link, stock status, and add-to-cart.
- `/artisan/:id`: **Artisan Profile** highlighting the artisan's story, verified badge, followers, WhatsApp enquiry modal, and active listings.
- `/cart`: **Shopping Cart** with quantity stepper, price breakdown, and smooth transition to checkout.
- `/checkout`: **Checkout** form with input validation and instant order placement.
- `/order-confirmation`: **Order Confirmation** with unique order ID, summary, and status badges.
- `/craft-circle`: **Artisan Learning Circle** with video masterclasses, live workshop booking, and discussion forum.
- `/help`: **Help Center** with spoken voice-guide, WhatsApp support simulator, and FAQ accordion.

### Artisan Dashboard
- `/artisan/dashboard`: **Overview Dashboard** with metric cards, sales trend chart, best-selling crafts, and recent orders.
- `/artisan/add-product`: **Speak & Sell Wizard** with live mic recording, language toggle, image preview, AI enhancement preview, and listing submit.
- `/artisan/products`: **Product Inventory Management** with search, status toggling, and delete confirmation dialog.
- `/artisan/orders`: **Order Management** with status workflow actions (Pending → Processing → Shipped → Delivered).

---

## 🎨 Design Philosophy & Heritage Palette

| Color | Hex | Role |
|---|---|---|
| **Deep Forest** | `#1C3F3A` | Primary brand color, headers, primary buttons |
| **Deep Green** | `#142F2B` | Hover states, dark accents |
| **Warm Terracotta** | `#C85A32` | Accent buttons, highlights, badges, CTA |
| **Warm Sand** | `#E5D3B3` | Soft borders, subtle cards, warm accents |
| **Natural Sage** | `#D4DDD4` | Neutral background accents, muted borders |
| **Artisan Cream** | `#FAF7F2` | Page background, serene backdrop |
| **Charcoal Ink** | `#262626` | High-contrast readable typography |

---

## 🎓 Hackathon Demonstration Notes
*This is a frontend demonstration prototype for hackathon presentation purposes. All transactions, order updates, WhatsApp messages, and voice AI listings run client-side with persistent LocalStorage.*