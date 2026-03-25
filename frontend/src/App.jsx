import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCoupons from "./pages/admin/AdminCoupons";
import EditProduct from "./pages/admin/EditProduct";
import Profile from "./pages/Profile";
import MyExchanges from "./pages/MyExchanges";
import AdminExchanges from "./pages/admin/AdminExchanges";
import AdminContactMessages from "./pages/admin/AdminContactMessages";
import AdminNewsletterSubscribers from "./pages/admin/AdminNewsletterSubscribers";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ShippingPolicy from "./pages/ShippingPolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/exchanges" element={<MyExchanges />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/return-policy" element={<ReturnPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />

          <Route
            path="/admin"
            element={
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminLayout>
                <AdminProducts />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/products/add"
            element={
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/coupons"
            element={
              <AdminLayout>
                <AdminCoupons />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/exchanges"
            element={
              <AdminLayout>
                <AdminExchanges />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/contact-messages"
            element={
              <AdminLayout>
                <AdminContactMessages />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/newsletter-subscribers"
            element={
              <AdminLayout>
                <AdminNewsletterSubscribers />
              </AdminLayout>
            }
          />

          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminLayout>
                <EditProduct />
              </AdminLayout>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;