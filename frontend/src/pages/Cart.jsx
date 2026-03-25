import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getCartItemsApi,
  removeCartItemApi,
  applyCouponApi,
} from "../services/api";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";
import PageHeaderSkeleton from "../components/PageHeaderSkeleton";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getCartItemsApi(token);
      setCartItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();

    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      const parsed = JSON.parse(savedCoupon);
      setCouponData(parsed);
      setCouponCode(parsed.code || "");
    }
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item?.product?.price || 0) * Number(item?.quantity || 0);
    }, 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item?.quantity || 0);
    }, 0);
  }, [cartItems]);

  const handleRemove = async (cartItemId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      await removeCartItemApi(cartItemId, token);
      toast.success("Item removed from cart");

      const updatedCart = cartItems.filter((item) => item._id !== cartItemId);
      setCartItems(updatedCart);

      if (couponData) {
        localStorage.removeItem("appliedCoupon");
        setCouponData(null);
        setCouponCode("");
      }

      fetchCartItems();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleApplyCoupon = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      if (!couponCode.trim()) {
        toast.error("Please enter coupon code");
        return;
      }

      if (cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      setApplyingCoupon(true);

      const data = await applyCouponApi(couponCode.trim(), cartTotal, token);

      const fullCouponData = {
        ...data,
        code: couponCode.trim().toUpperCase(),
      };

      setCouponData(fullCouponData);
      localStorage.setItem("appliedCoupon", JSON.stringify(fullCouponData));

      toast.success("Coupon applied successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponData(null);
    localStorage.removeItem("appliedCoupon");
    toast.success("Coupon removed");
  };

  const finalTotal = couponData ? Number(couponData.finalPrice || 0) : cartTotal;
  const discountAmount = couponData ? Number(couponData.discount || 0) : 0;

  if (loading) {
    return (
      <div className="bg-[#fcfaf7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <PageHeaderSkeleton />

          <div className="grid gap-10 lg:grid-cols-[1.7fr_0.9fr]">
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-[30px] border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:p-5"
                >
                  <Skeleton className="h-32 w-full rounded-[24px] sm:w-32" />
                  <div className="flex-1">
                    <Skeleton className="mb-3 h-6 w-1/2" />
                    <Skeleton className="mb-3 h-4 w-24" />
                    <Skeleton className="mb-3 h-4 w-28" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-10 w-28 rounded-full" />
                </div>
              ))}
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-[#f8f2ea] p-6">
              <Skeleton className="mb-6 h-8 w-44" />
              <Skeleton className="mb-4 h-12 w-full rounded-2xl" />
              <Skeleton className="mb-4 h-12 w-full rounded-full" />
              <Skeleton className="mb-4 h-5 w-full" />
              <Skeleton className="mb-4 h-5 w-full" />
              <Skeleton className="mb-4 h-5 w-full" />
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!localStorage.getItem("token")) {
    return <div className="py-20 text-center text-lg">Please login first</div>;
  }

  return (
    <div className="bg-[#fcfaf7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-8 rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Your Bag
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[46px]">
                Shopping Cart
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
                Review your selected jewellery, apply your coupon, and continue
                to a premium checkout experience.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                Cart Overview
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">
                {totalQuantity} Item{totalQuantity !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </section>

        {cartItems.length === 0 ? (
          <div className="rounded-[34px] border border-stone-200 bg-white px-6 py-16 text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
              Your Bag Is Empty
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-stone-900">
              No products in cart
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Explore our collection and add your favourite jewellery pieces to
              continue shopping.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.7fr_0.9fr]">
            {/* Left Side */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col gap-4 rounded-[30px] border border-stone-200 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="h-32 w-full overflow-hidden rounded-[24px] bg-[#f6efe7] sm:w-32">
                    {item.product?.images && item.product.images.length > 0 ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-stone-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                      {item.product?.category || "Premium Edit"}
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-stone-900">
                      {item.product?.name}
                    </h2>

                    <p className="mt-1 text-sm capitalize text-stone-500">
                      {item.product?.type}
                    </p>

                    {item.selectedVariant?.name && item.selectedVariant?.value && (
                      <p className="mt-2 text-sm text-stone-600">
                        Variant: {item.selectedVariant.name} - {item.selectedVariant.value}
                      </p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-stone-600">
                      <span>Quantity: {item.quantity}</span>
                      <span>•</span>
                      <span>Price: ₹{item.product?.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <p className="text-xl font-semibold text-stone-900">
                      ₹{Number(item.product?.price || 0) * Number(item.quantity || 0)}
                    </p>

                    <button
                      onClick={() => handleRemove(item._id)}
                      className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:border-black hover:bg-black hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <div className="rounded-[30px] border border-stone-200 bg-white p-6">
                <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
                  Need More?
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-stone-900">
                  Continue exploring our collection
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Add more rings, necklaces, bracelets, and earrings to complete
                  your jewellery edit.
                </p>

                <Link
                  to="/products"
                  className="mt-5 inline-flex rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-black hover:bg-black hover:text-white"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="h-fit rounded-[32px] border border-stone-200 bg-[#f8f2ea] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] lg:sticky lg:top-28">
              <h2 className="mb-6 text-2xl font-semibold text-stone-900">
                Order Summary
              </h2>

              <div className="mb-6 rounded-[26px] border border-stone-200 bg-white p-5">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Coupon Code
                </label>

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon"
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                  />

                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                    className="rounded-full bg-black px-5 py-3 text-sm text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                  >
                    {applyingCoupon ? "Applying..." : "Apply"}
                  </button>
                </div>

                {couponData && (
                  <button
                    onClick={handleRemoveCoupon}
                    className="mt-3 text-sm font-medium text-red-600 hover:underline"
                  >
                    Remove Coupon
                  </button>
                )}
              </div>

              <div className="space-y-4 border-b border-stone-200 pb-6 text-sm">
                <div className="flex items-center justify-between text-stone-600">
                  <span>Items</span>
                  <span>{totalQuantity}</span>
                </div>

                <div className="flex items-center justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>

                {couponData && (
                  <>
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Coupon</span>
                      <span>{couponData.code}</span>
                    </div>

                    <div className="flex items-center justify-between text-green-600">
                      <span>Discount</span>
                      <span>- ₹{discountAmount.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="py-6">
                <div className="mb-6 flex items-center justify-between text-stone-900">
                  <span className="text-base font-medium">Final Total</span>
                  <span className="text-2xl font-semibold">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full rounded-full bg-black px-6 py-3.5 text-sm font-medium tracking-[0.16em] text-white transition hover:bg-stone-800"
                >
                  PROCEED TO CHECKOUT
                </button>

                <p className="mt-4 text-center text-xs leading-6 text-stone-500">
                  Secure checkout with coupon support and wallet benefits.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;