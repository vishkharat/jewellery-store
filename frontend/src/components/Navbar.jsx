import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiX,
  FiMenu,
} from "react-icons/fi";
import {
  getSearchSuggestionsApi,
  getCartCountApi,
  getWishlistCountApi,
  getUserProfileApi,
} from "../services/api";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `text-[13px] uppercase tracking-[0.22em] transition ${
      isActive ? "text-black font-medium" : "text-stone-600 hover:text-black"
    }`;

  const fetchCounts = async () => {
    try {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }

      if (!token) {
        setCartCount(0);
        setWishlistCount(0);
        return;
      }

      const [cartData, wishlistData, freshProfile] = await Promise.all([
        getCartCountApi(token),
        getWishlistCountApi(token),
        getUserProfileApi(token),
      ]);

      setCartCount(cartData.length || 0);
      setWishlistCount(wishlistData.length || 0);

      if (freshProfile) {
        setUser(freshProfile);
        localStorage.setItem("user", JSON.stringify(freshProfile));
      }
    } catch (error) {
      console.log("Error fetching navbar counts", error);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        if (!searchTerm.trim()) {
          setSuggestions([]);
          return;
        }

        const data = await getSearchSuggestionsApi(searchTerm);
        setSuggestions(data || []);
      } catch (error) {
        console.log("Error fetching search suggestions", error);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    if (mobileMenuOpen || showSearchBox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, showSearchBox]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("appliedCoupon");
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
    toast.success("Logged out successfully");
    setMobileMenuOpen(false);
    navigate("/login");
    window.location.reload();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) return;

    navigate(`/products?search=${searchTerm}`);
    setShowSearchBox(false);
    setMobileMenuOpen(false);
  };

  const handleSuggestionClick = (name) => {
    setSearchTerm(name);
    setSuggestions([]);
    setShowSearchBox(false);
    setMobileMenuOpen(false);
    navigate(`/products?search=${name}`);
  };

  const closeAllOverlays = () => {
    setMobileMenuOpen(false);
    setShowSearchBox(false);
    setSuggestions([]);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-stone-200 bg-[#fcfaf7]/95 backdrop-blur-md">
        <div className="border-b border-stone-200 px-4 py-2 text-center text-[10px] uppercase tracking-[0.28em] text-stone-500 sm:px-6 lg:px-10">
          Premium jewellery for everyday elegance
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10 lg:py-4">
          {/* Desktop Left */}
          <nav className="hidden items-center gap-7 lg:flex">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Shop
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
            <NavLink to="/wishlist" className={navLinkClass}>
              Wishlist
            </NavLink>
            <NavLink to="/orders" className={navLinkClass}>
              Orders
            </NavLink>
            <NavLink to="/exchanges" className={navLinkClass}>
              Exchanges
            </NavLink>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => {
              setMobileMenuOpen(true);
              setShowSearchBox(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 lg:hidden"
            aria-label="Open menu"
          >
            <FiMenu size={18} />
          </button>

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-[0.38em] text-stone-500 sm:text-[11px]">
              Fine Jewellery
            </span>
            <h1 className="text-xl font-semibold tracking-[0.26em] text-stone-900 sm:text-[28px]">
              AURUM
            </h1>
          </Link>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                setShowSearchBox((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 hover:text-black sm:h-11 sm:w-11"
              aria-label="Search"
            >
              <FiSearch />
            </button>

            <Link
              to="/wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 hover:text-black sm:flex sm:h-11 sm:w-11"
              aria-label="Wishlist"
            >
              <FiHeart />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 hover:text-black sm:h-11 sm:w-11"
              aria-label="Cart"
            >
              <FiShoppingBag />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="hidden text-right xl:block">
                  <p className="text-sm font-medium text-stone-900 hover:underline">
                    {user.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    {user.role}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Wallet: {Number(user.silverWalletGrams ?? 0).toFixed(3)} g
                  </p>
                </Link>

                <button
                  onClick={handleLogout}
                  className="hidden h-11 w-11 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 hover:text-black lg:flex"
                  aria-label="Logout"
                >
                  <FiLogOut />
                </button>

                <Link
                  to="/profile"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 hover:text-black lg:hidden"
                  aria-label="Profile"
                >
                  <FiUser />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700 transition hover:bg-stone-100 hover:text-black sm:h-11 sm:w-11"
                aria-label="Login"
              >
                <FiUser />
              </Link>
            )}
          </div>
        </div>

        {/* Search box */}
        {showSearchBox && (
          <div className="border-t border-stone-200 bg-white px-4 py-4 sm:px-6 lg:px-10">
            <div className="mx-auto max-w-3xl">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search rings, necklaces, bracelets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-full border border-stone-300 bg-[#fcfaf7] px-5 py-3 pr-12 text-sm outline-none transition focus:border-black"
                />

                <button
                  type="button"
                  onClick={() => {
                    setShowSearchBox(false);
                    setSearchTerm("");
                    setSuggestions([]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-black"
                >
                  <FiX />
                </button>
              </form>

              {suggestions.length > 0 && (
                <div className="mt-3 overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-xl">
                  {suggestions.map((item, index) => (
                    <button
                      key={item._id || index}
                      onClick={() => handleSuggestionClick(item.name)}
                      className="block w-full border-b border-stone-100 px-5 py-3 text-left text-sm text-stone-700 transition last:border-b-0 hover:bg-stone-50"
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeAllOverlays}
          />

          <div className="absolute left-0 top-0 h-[100dvh] w-[86%] max-w-[360px] overflow-y-auto bg-[#fcfaf7] shadow-2xl">
            <div className="sticky top-0 z-20 border-b border-stone-200 bg-white px-5 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">
                    Fine Jewellery
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-[0.22em] text-stone-900">
                    AURUM
                  </h2>
                </div>

                <button
                  onClick={closeAllOverlays}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 bg-white text-stone-700"
                >
                  <FiX />
                </button>
              </div>
            </div>

            <div className="space-y-6 px-5 py-5">
              {user ? (
                <div className="rounded-[22px] border border-stone-200 bg-white p-4">
                  <p className="text-base font-semibold text-stone-900">
                    {user.name}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-stone-500">
                    {user.role}
                  </p>
                  <p className="mt-2 text-sm text-stone-600">
                    Wallet: {Number(user.silverWalletGrams ?? 0).toFixed(3)} g
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Link
                      to="/profile"
                      onClick={closeAllOverlays}
                      className="rounded-full border border-stone-300 px-4 py-2.5 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-[22px] border border-stone-200 bg-white p-4">
                  <p className="text-sm leading-7 text-stone-600">
                    Login karo to wishlist, orders, wallet ane checkout features
                    access kari shako.
                  </p>

                  <Link
                    to="/login"
                    onClick={closeAllOverlays}
                    className="mt-4 inline-flex rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    Login / Register
                  </Link>
                </div>
              )}

              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-stone-500">
                  Main Menu
                </p>

                <div className="space-y-3">
                  <NavLink
                    to="/"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/products"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Shop All Products
                  </NavLink>

                  <NavLink
                    to="/about"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    About
                  </NavLink>

                  <NavLink
                    to="/contact"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Contact
                  </NavLink>

                  <NavLink
                    to="/wishlist"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ""}
                  </NavLink>

                  <NavLink
                    to="/cart"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Cart {cartCount > 0 ? `(${cartCount})` : ""}
                  </NavLink>

                  <NavLink
                    to="/orders"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Orders
                  </NavLink>

                  <NavLink
                    to="/exchanges"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Exchanges
                  </NavLink>

                  <NavLink
                    to="/shipping-policy"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Shipping Policy
                  </NavLink>

                  <NavLink
                    to="/return-policy"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Return Policy
                  </NavLink>

                  <NavLink
                    to="/privacy-policy"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Privacy Policy
                  </NavLink>

                  <NavLink
                    to="/terms"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Terms & Conditions
                  </NavLink>

                  <NavLink
                    to="/profile"
                    onClick={closeAllOverlays}
                    className="block rounded-[18px] border border-stone-200 bg-white px-4 py-3.5 text-sm text-stone-700"
                  >
                    Profile
                  </NavLink>
                </div>
              </div>

              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-stone-500">
                  Quick Shop
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/products?type=ring"
                    onClick={closeAllOverlays}
                    className="rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
                  >
                    Rings
                  </Link>

                  <Link
                    to="/products?type=necklace"
                    onClick={closeAllOverlays}
                    className="rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
                  >
                    Necklaces
                  </Link>

                  <Link
                    to="/products?type=bracelet"
                    onClick={closeAllOverlays}
                    className="rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
                  >
                    Bracelets
                  </Link>

                  <Link
                    to="/products?type=earring"
                    onClick={closeAllOverlays}
                    className="rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700"
                  >
                    Earrings
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-stone-200 px-5 py-4 text-center text-[11px] uppercase tracking-[0.18em] text-stone-500">
              AURUM Premium Jewellery
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;