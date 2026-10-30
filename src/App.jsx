import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Storefront Components & Pages
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthModal } from "./components/AuthModal";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { CustomizeGifts } from "./pages/CustomizeGifts";
import { ShopByCategory } from "./pages/ShopByCategory";
import { ByRecipient } from "./pages/ByRecipient";
import { ByOccasion } from "./pages/ByOccasion";
import { FeaturedProducts } from "./pages/FeaturedProducts";
import { ProductGallery } from "./pages/ProductGallery";
import { RentProducts } from "./pages/RentProducts";
import { Wishlist } from "./pages/Wishlist";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { MyOrders } from "./pages/MyOrders";
import { Contact } from "./pages/Contact";
import { UserPanel } from "./pages/UserPanel";
import { MyProfile } from "./pages/MyProfile";
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Admin Panel Components & Pages
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminOrders } from "./pages/admin/AdminOrders";
import { AdminProducts } from "./pages/admin/AdminProducts";
import { AdminCustomers } from "./pages/admin/AdminCustomers";
import { AdminEnquiries } from "./pages/admin/AdminEnquiries";
import { AdminPages } from "./pages/admin/AdminPages";
import { AdminHomeSections } from "./pages/admin/AdminHomeSections";
import { AdminHero } from "./pages/admin/AdminHero";
import { AdminFooter } from "./pages/admin/AdminFooter";
import { AdminMedia } from "./pages/admin/AdminMedia";
import { AdminContent } from "./pages/admin/AdminContent";


// Storefront layout wrapper
const StoreLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5EEDC] w-full">
      <Navbar />
      <AuthModal />
      <main className="flex-grow w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Storefront Routes */}
            <Route path="/" element={<StoreLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="customize-gifts" element={<CustomizeGifts />} />
              <Route path="customize" element={<CustomizeGifts />} />
              <Route path="shop-by-category" element={<ShopByCategory />} />
              <Route path="shop-gifts" element={<ShopByCategory />} />
              <Route path="categories" element={<ShopByCategory />} />
              <Route path="by-recipient" element={<ByRecipient />} />
              <Route path="recipient" element={<ByRecipient />} />
              <Route path="by-occasion" element={<ByOccasion />} />
              <Route path="occasion" element={<ByOccasion />} />
              <Route path="featured-products" element={<FeaturedProducts />} />
              <Route path="featured" element={<FeaturedProducts />} />
              <Route path="product-gallery" element={<ProductGallery />} />
              <Route path="gallery" element={<ProductGallery />} />
              <Route path="rent" element={<RentProducts />} />
              <Route path="rent-products" element={<RentProducts />} />
              <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="my-favourite-list" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="favourites" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
              <Route path="shop" element={<ShopByCategory />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
              <Route path="my-profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
              <Route path="my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
              <Route path="contact" element={<Contact />} />
              <Route path="my-account" element={<ProtectedRoute><UserPanel /></ProtectedRoute>} />
              <Route path="dashboard" element={<ProtectedRoute><UserPanel /></ProtectedRoute>} />
              <Route path="register" element={<AuthPage initialMode="register" />} />
              <Route path="login" element={<AuthPage initialMode="login" />} />
              <Route path="auth" element={<AuthPage initialMode="register" />} />
            </Route>

            {/* Dedicated Admin Panel Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="enquiries" element={<AdminEnquiries />} />
              <Route path="pages" element={<AdminPages />} />
              <Route path="hero" element={<AdminHero />} />
              <Route path="home-sections" element={<AdminHomeSections />} />
              <Route path="footer" element={<AdminFooter />} />
              <Route path="media" element={<AdminMedia />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="settings" element={<AdminContent />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<StoreLayout />}>
              <Route index element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
