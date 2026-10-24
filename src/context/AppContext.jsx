import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialProducts } from '../data/products';
import { initialOrders } from '../data/orders';

const AppContext = createContext(null);

const LS = {
  cart: 'cc_cart',
  wishlist: 'cc_wishlist',
  products: 'cc_products_v2',
  orders: 'cc_orders_v2',
  draftProduct: 'cc_draft_product',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => load(LS.cart, []));
  const [wishlist, setWishlist] = useState(() => load(LS.wishlist, []));
  const [products, setProducts] = useState(() => load(LS.products, initialProducts));
  const [orders, setOrders] = useState(() => load(LS.orders, initialOrders));
  const [toast, setToast] = useState(null);
  const [draftProduct, setDraftProductState] = useState(() => load(LS.draftProduct, null));

  useEffect(() => { save(LS.cart, cart); }, [cart]);
  useEffect(() => { save(LS.wishlist, wishlist); }, [wishlist]);
  useEffect(() => { save(LS.products, products); }, [products]);
  useEffect(() => { save(LS.orders, orders); }, [orders]);
  useEffect(() => { save(LS.draftProduct, draftProduct); }, [draftProduct]);

  // Toast
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Cart
  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        const updated = prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
        showToast(`Updated quantity in cart`);
        return updated;
      }
      showToast(`${product.name} added to cart`);
      return [...prev, { ...product, qty }];
    });
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(i => i.id !== productId));
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const updateCartQty = useCallback((productId, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(i => i.id === productId ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  // Wishlist
  const toggleWishlist = useCallback((productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      }
      showToast('Added to wishlist');
      return [...prev, productId];
    });
  }, [showToast]);

  const isWishlisted = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  // Products
  const addProduct = useCallback((product) => {
    const newProduct = {
      ...product,
      id: `p${Date.now()}`,
      artisanId: 'a1',
      artisanName: 'Savitha Naik',
      artisanLocation: 'Udupi, Karnataka',
      rating: 0,
      reviewCount: 0,
      isHandmade: true,
      createdAt: new Date().toISOString().split('T')[0],
      featured: false,
      tags: [],
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast('Product listed successfully!');
    return newProduct;
  }, [showToast]);

  const updateProduct = useCallback((productId, updates) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updates } : p));
    showToast('Product updated');
  }, [showToast]);

  const deleteProduct = useCallback((productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Product deleted', 'info');
  }, [showToast]);

  // Orders
  const placeOrder = useCallback((orderData) => {
    const orderId = `ORD-${Date.now()}`;
    const newOrders = cart.map(item => ({
      id: `${orderId}-${item.id}`,
      productId: item.id,
      productName: item.name,
      productImage: item.image,
      artisanId: item.artisanId,
      buyerName: orderData.name,
      buyerCity: orderData.city,
      quantity: item.qty,
      unitPrice: item.price,
      total: item.price * item.qty,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      deliveryDate: null,
    }));
    setOrders(prev => [...newOrders, ...prev]);
    clearCart();
    return orderId;
  }, [cart, clearCart]);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order status updated to ${status}`);
  }, [showToast]);

  // Draft product
  const setDraftProduct = useCallback((draft) => {
    setDraftProductState(draft);
  }, []);

  const clearDraft = useCallback(() => {
    setDraftProductState(null);
    localStorage.removeItem(LS.draftProduct);
  }, []);

  // Reset demo data
  const resetDemoData = useCallback(() => {
    setCart([]);
    setWishlist([]);
    setProducts(initialProducts);
    setOrders(initialOrders);
    setDraftProductState(null);
    Object.values(LS).forEach(k => localStorage.removeItem(k));
    showToast('Demo data reset to defaults', 'info');
  }, [showToast]);

  return (
    <AppContext.Provider value={{
      // Cart
      cart, cartCount, cartTotal,
      addToCart, removeFromCart, updateCartQty, clearCart,
      // Wishlist
      wishlist, toggleWishlist, isWishlisted,
      // Products
      products, addProduct, updateProduct, deleteProduct,
      // Orders
      orders, placeOrder, updateOrderStatus,
      // Draft
      draftProduct, setDraftProduct, clearDraft,
      // Toast
      toast, showToast,
      // Reset
      resetDemoData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
