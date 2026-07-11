import React from "react";
import "@/index.css";
import "@/App.css";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import { AppProviders } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetails from "@/pages/ProductDetails";
import Cart from "@/pages/Cart";
import Wishlist from "@/pages/Wishlist";
import About from "@/pages/About";
import CollectionsPage from "@/pages/CollectionsPage";
import CategoriesPage from "@/pages/CategoriesPage";

import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminSettings from "@/pages/admin/AdminSettings";
import { AdminCategories, AdminCollections, AdminOffers, AdminBanners } from "@/pages/admin/AdminCrudPages";

function CustomerShell() {
  const location = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return (
    <>
      <Header/>
      <main><Outlet/></main>
      <Footer/>
    </>
  );
}

function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <Toaster position="bottom-right" theme="light" toastOptions={{ style: { fontFamily: "Outfit" }}}/>
        <Routes>
          {/* Customer */}
          <Route element={<CustomerShell/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/shop" element={<Shop/>}/>
            <Route path="/product/:slug" element={<ProductDetails/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/wishlist" element={<Wishlist/>}/>
            <Route path="/about" element={<About/>}/>
            <Route path="/collections" element={<CollectionsPage/>}/>
            <Route path="/categories" element={<CategoriesPage/>}/>
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin/>}/>
          <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<AdminDashboard/>}/>
            <Route path="products" element={<AdminProducts/>}/>
            <Route path="categories" element={<AdminCategories/>}/>
            <Route path="collections" element={<AdminCollections/>}/>
            <Route path="offers" element={<AdminOffers/>}/>
            <Route path="banners" element={<AdminBanners/>}/>
            <Route path="settings" element={<AdminSettings/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProviders>
  );
}

export default App;
