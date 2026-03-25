import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { subscribeNewsletterApi } from "../services/api";

function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await subscribeNewsletterApi(email.trim());

      toast.success(response.message || "Subscribed successfully");
      setEmail("");
    } catch (error) {
      console.log("Newsletter subscribe error:", error);
      toast.error(
        error.response?.data?.message || "Failed to subscribe to newsletter"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-stone-200 bg-[#f8f3ec]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1fr]">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.38em] text-stone-500">
              Fine Jewellery
            </p>
            <h2 className="mb-4 text-2xl font-semibold tracking-[0.26em] text-stone-900">
              AURUM
            </h2>
            <p className="max-w-sm text-sm leading-7 text-stone-600">
              Elegant jewellery curated for everyday luxury, thoughtful gifting,
              and modern feminine styling with a premium shopping experience.
            </p>

            <div className="mt-6 grid max-w-md grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                Secure Payments
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                Premium Styling
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                Gift-Worthy Picks
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-sm text-stone-700">
                Easy Shopping
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-stone-800">
              Shop
            </h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <Link to="/products" className="transition hover:text-black">
                  All Jewellery
                </Link>
              </li>
              <li>
                <Link
                  to="/products?type=ring"
                  className="transition hover:text-black"
                >
                  Rings
                </Link>
              </li>
              <li>
                <Link
                  to="/products?type=necklace"
                  className="transition hover:text-black"
                >
                  Necklaces
                </Link>
              </li>
              <li>
                <Link
                  to="/products?type=bracelet"
                  className="transition hover:text-black"
                >
                  Bracelets
                </Link>
              </li>
              <li>
                <Link
                  to="/products?type=earring"
                  className="transition hover:text-black"
                >
                  Earrings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-stone-800">
              Support
            </h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <Link to="/about" className="transition hover:text-black">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-black">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/profile" className="transition hover:text-black">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/orders" className="transition hover:text-black">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="transition hover:text-black">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-stone-800">
              Policies
            </h3>
            <ul className="space-y-3 text-sm text-stone-600">
              <li>
                <Link
                  to="/shipping-policy"
                  className="transition hover:text-black"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/return-policy"
                  className="transition hover:text-black"
                >
                  Return Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  className="transition hover:text-black"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition hover:text-black">
                  Terms & Conditions
                </Link>
              </li>
            </ul>

            <div className="mt-6">
              <p className="mb-4 text-sm leading-7 text-stone-600">
                Get collection updates, styling edits, launch drops, and premium
                gifting inspiration.
              </p>

              <form onSubmit={handleNewsletterSubmit}>
                <div className="overflow-hidden rounded-full border border-stone-300 bg-white">
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent px-4 py-3 text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {loading ? "Joining..." : "Join Newsletter"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 px-4 py-5 text-center text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:px-6 lg:px-10">
        © 2026 AURUM Jewellery. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;