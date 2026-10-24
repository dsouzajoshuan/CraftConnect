import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ToastNotification from './components/common/ToastNotification';

import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import ArtisanDashboard from './pages/ArtisanDashboard';
import AddProduct from './pages/AddProduct';
import MyProducts from './pages/MyProducts';
import ArtisanOrders from './pages/ArtisanOrders';
import CraftCircle from './pages/CraftCircle';
import Help from './pages/Help';
import ArtisanProfile from './pages/ArtisanProfile';
import ArtisanSettings from './pages/ArtisanSettings';

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}

function ArtisanLayout({ children }) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/marketplace" element={<PublicLayout><Marketplace /></PublicLayout>} />
          <Route path="/product/:id" element={<PublicLayout><ProductDetails /></PublicLayout>} />
          <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
          <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
          <Route path="/order-confirmation" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />
          <Route path="/craft-circle" element={<PublicLayout><CraftCircle /></PublicLayout>} />
          <Route path="/help" element={<PublicLayout><Help /></PublicLayout>} />
          <Route path="/artisan/:id" element={<PublicLayout><ArtisanProfile /></PublicLayout>} />

          {/* Artisan dashboard routes */}
          <Route path="/artisan/dashboard" element={<ArtisanLayout><ArtisanDashboard /></ArtisanLayout>} />
          <Route path="/artisan/add-product" element={<ArtisanLayout><AddProduct /></ArtisanLayout>} />
          <Route path="/artisan/products" element={<ArtisanLayout><MyProducts /></ArtisanLayout>} />
          <Route path="/artisan/orders" element={<ArtisanLayout><ArtisanOrders /></ArtisanLayout>} />
          <Route path="/artisan/settings" element={<ArtisanLayout><ArtisanSettings /></ArtisanLayout>} />
        </Routes>
        <ToastNotification />
      </AppProvider>
    </BrowserRouter>
  );
}
