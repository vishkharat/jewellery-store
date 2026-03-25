import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  getCartItemsApi,
  placeOrderApi,
  createPaymentOrderApi,
  verifyPaymentApi,
  getUserProfileApi,
  getAddressesApi,
} from "../services/api";
import toast from "react-hot-toast";

function Checkout() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [pricingPreview, setPricingPreview] = useState(null);

  const [walletGramsToUse, setWalletGramsToUse] = useState("");

  const silverRate = Number(import.meta.env.VITE_SILVER_WALLET_RATE || 80);

  const fetchCheckoutData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const [cartData, profileData, addressData] = await Promise.all([
        getCartItemsApi(token),
        getUserProfileApi(token),
        getAddressesApi(token),
      ]);

      setCartItems(Array.isArray(cartData) ? cartData : []);
      setUserProfile(profileData || null);

      if (profileData) {
        localStorage.setItem("user", JSON.stringify(profileData));
      }

      const finalAddresses = Array.isArray(addressData) ? addressData : [];
      setAddresses(finalAddresses);

      if (finalAddresses.length > 0) {
        const defaultAddress =
          finalAddresses.find((addr) => addr.isDefault) || finalAddresses[0];
        setSelectedAddressId(defaultAddress._id);
      }
    } catch (error) {
      console.log("Checkout fetch error:", error);
      toast.error("Failed to load checkout data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckoutData();

    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon) {
      try {
        setCouponData(JSON.parse(savedCoupon));
      } catch (error) {
        console.log("Coupon parse error:", error);
        localStorage.removeItem("appliedCoupon");
      }
    }
  }, []);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return (
        total +
        Number(item?.product?.price || 0) * Number(item?.quantity || 0)
      );
    }, 0);
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item?.quantity || 0);
    }, 0);
  }, [cartItems]);

  const walletBalance = Number(userProfile?.silverWalletGrams ?? 0);
  const couponDiscount = Number(couponData?.discount ?? 0);
  const totalAfterCoupon = Math.max(cartTotal - couponDiscount, 0);

  const estimatedWalletDiscount = useMemo(() => {
    const requestedGramsRaw = parseFloat(walletGramsToUse);
    const requestedGrams = Number.isFinite(requestedGramsRaw)
      ? Math.max(requestedGramsRaw, 0)
      : 0;

    const availableGrams = Number.isFinite(walletBalance)
      ? Math.max(walletBalance, 0)
      : 0;

    const validGrams = Math.min(requestedGrams, availableGrams);
    const calculatedDiscount = validGrams * silverRate;

    return Number(Math.min(calculatedDiscount, totalAfterCoupon).toFixed(2));
  }, [walletGramsToUse, walletBalance, silverRate, totalAfterCoupon]);

  const estimatedFinalTotal = useMemo(() => {
    return Number(
      Math.max(totalAfterCoupon - estimatedWalletDiscount, 0).toFixed(2)
    );
  }, [totalAfterCoupon, estimatedWalletDiscount]);

  const selectedAddress = useMemo(() => {
    return addresses.find((addr) => addr._id === selectedAddressId) || null;
  }, [addresses, selectedAddressId]);

  const handleUseFullWallet = () => {
    setWalletGramsToUse(String(walletBalance));
  };

  const handleClearWalletUse = () => {
    setWalletGramsToUse("");
  };

  const buildShippingAddress = () => {
    if (!selectedAddress) return null;

    return {
      fullName: selectedAddress.fullName || "",
      phone: selectedAddress.phone || "",
      addressLine: selectedAddress.addressLine || "",
      city: selectedAddress.city || "",
      state: selectedAddress.state || "",
      postalCode: selectedAddress.postalCode || "",
      country: selectedAddress.country || "India",
    };
  };

  const handleWalletOnlyOrder = async (paymentResponse, token) => {
    const shippingAddress = buildShippingAddress();

    if (!shippingAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    const orderPayload = {
      couponCode: couponData?.code || "",
      walletGramsUsed: Number(paymentResponse?.pricing?.walletGramsUsed || 0),
      shippingAddress,
    };

    await placeOrderApi(orderPayload, token);

    localStorage.removeItem("appliedCoupon");
    toast.success("Order placed successfully using wallet credit");
    navigate("/orders");
  };

  const handleRazorpayOrder = async (paymentResponse, token) => {
    const shippingAddress = buildShippingAddress();

    if (!shippingAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!paymentResponse?.id) {
      toast.error("Payment order not created properly");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: paymentResponse.amount,
      currency: paymentResponse.currency,
      name: "AURUM Jewellery",
      description: "Jewellery Purchase",
      order_id: paymentResponse.id,
      handler: async function (response) {
        try {
          const verificationPayload = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            pricing: paymentResponse?.pricing || {},
          };

          await verifyPaymentApi(verificationPayload, token);

          const orderPayload = {
            couponCode: couponData?.code || "",
            walletGramsUsed: Number(
              paymentResponse?.pricing?.walletGramsUsed || 0
            ),
            shippingAddress,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          };

          await placeOrderApi(orderPayload, token);

          localStorage.removeItem("appliedCoupon");
          toast.success("Payment successful and order placed");
          navigate("/orders");
        } catch (error) {
          console.log("Post-payment order error:", error);
          toast.error(
            error?.response?.data?.message ||
              "Payment verified but order failed"
          );
        } finally {
          setPaying(false);
        }
      },
      prefill: {
        name: userProfile?.name || "",
        email: userProfile?.email || "",
      },
      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function () {
          setPaying(false);
          toast.error("Payment cancelled");
        },
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.log("Razorpay payment failed:", response);
      setPaying(false);
      toast.error("Payment failed");
    });

    razorpay.open();
  };

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      if (!selectedAddress) {
        toast.error("Please select a shipping address");
        return;
      }

      const parsedWalletGrams = Number(walletGramsToUse || 0);

      if (Number.isNaN(parsedWalletGrams) || parsedWalletGrams < 0) {
        toast.error("Wallet grams cannot be negative");
        return;
      }

      setPaying(true);

      const checkoutPayload = {
        couponCode: couponData?.code || "",
        walletGramsToUse: parsedWalletGrams,
      };

      const paymentResponse = await createPaymentOrderApi(
        checkoutPayload,
        token
      );

      setPricingPreview(paymentResponse?.pricing || null);

      if (paymentResponse?.paymentRequired === false) {
        await handleWalletOnlyOrder(paymentResponse, token);
        setPaying(false);
        return;
      }

      await handleRazorpayOrder(paymentResponse, token);
    } catch (error) {
      console.log("Checkout error:", error);
      setPaying(false);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to start checkout"
      );
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fcfaf7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse rounded-[36px] border border-stone-200 bg-white p-8">
            <div className="h-4 w-28 rounded-full bg-stone-200" />
            <div className="mt-4 h-12 w-72 rounded-2xl bg-stone-200" />
            <div className="mt-4 h-4 w-full max-w-2xl rounded-full bg-stone-200" />
          </div>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_0.95fr]">
            <div className="space-y-6">
              <div className="rounded-[32px] border border-stone-200 bg-white p-6">
                <div className="h-8 w-52 rounded-2xl bg-stone-200" />
                <div className="mt-5 space-y-4">
                  <div className="h-28 rounded-2xl bg-stone-100" />
                  <div className="h-28 rounded-2xl bg-stone-100" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-28 rounded-[30px] bg-white" />
                <div className="h-28 rounded-[30px] bg-white" />
              </div>
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-[#f8f2ea] p-6">
              <div className="h-8 w-48 rounded-2xl bg-stone-200" />
              <div className="mt-5 h-48 rounded-[26px] bg-white" />
              <div className="mt-5 space-y-4">
                <div className="h-4 rounded-full bg-stone-200" />
                <div className="h-4 rounded-full bg-stone-200" />
                <div className="h-4 rounded-full bg-stone-200" />
              </div>
              <div className="mt-6 h-12 rounded-full bg-stone-900/20" />
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
                Final Step
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[46px]">
                Checkout
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
                Confirm your address, review wallet benefits, and complete your
                premium jewellery order securely.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                Order Items
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
              Empty Checkout
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-stone-900">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Add products to your cart before continuing to checkout.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.6fr_0.95fr]">
            <div className="space-y-6">
              <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                      Delivery Details
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                      Shipping Address
                    </h2>
                  </div>

                  {addresses.length === 0 && (
                    <Link
                      to="/profile"
                      className="text-sm font-medium text-stone-700 hover:text-black"
                    >
                      Add Address →
                    </Link>
                  )}
                </div>

                {addresses.length === 0 ? (
                  <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    Please add address first from Profile page.
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {addresses.map((addr) => (
                      <label
                        key={addr._id}
                        className={`cursor-pointer rounded-[24px] border p-4 transition ${
                          selectedAddressId === addr._id
                            ? "border-black bg-[#faf7f2]"
                            : "border-stone-200 bg-white hover:border-stone-400"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="selectedAddress"
                            checked={selectedAddressId === addr._id}
                            onChange={() => setSelectedAddressId(addr._id)}
                            className="mt-1"
                          />

                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-stone-900">
                                {addr.fullName}
                              </p>

                              {addr.isDefault && (
                                <span className="rounded-full bg-stone-900 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-white">
                                  Default
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-sm text-stone-600">
                              {addr.phone}
                            </p>
                            <p className="mt-2 text-sm leading-7 text-stone-600">
                              {addr.addressLine}
                            </p>
                            <p className="text-sm text-stone-600">
                              {addr.city}, {addr.state}
                            </p>
                            <p className="text-sm text-stone-600">
                              {addr.postalCode}, {addr.country}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
                <div className="mb-5">
                  <p className="text-[11px] uppercase tracking-[0.26em] text-stone-500">
                    Order Review
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-stone-900">
                    Items In Your Order
                  </h2>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col gap-4 rounded-[28px] border border-stone-200 bg-[#fcfaf7] p-4 sm:flex-row sm:items-center"
                    >
                      <div className="h-28 w-full overflow-hidden rounded-[22px] bg-[#f6efe7] sm:w-28">
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

                        <h2 className="mt-2 text-lg font-semibold text-stone-900">
                          {item.product?.name}
                        </h2>

                        <p className="mt-1 text-sm capitalize text-stone-500">
                          {item.product?.type}
                        </p>

                        {item.selectedVariant?.name &&
                          item.selectedVariant?.value && (
                            <p className="mt-2 text-sm text-stone-600">
                              Variant: {item.selectedVariant.name} -{" "}
                              {item.selectedVariant.value}
                            </p>
                          )}

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-stone-600">
                          <span>Quantity: {item.quantity}</span>
                          <span>•</span>
                          <span>Unit Price: ₹{item.product?.price}</span>
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-lg font-semibold text-stone-900">
                          ₹
                          {Number(item.product?.price || 0) *
                            Number(item.quantity || 0)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="h-fit rounded-[32px] border border-stone-200 bg-[#f8f2ea] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] lg:sticky lg:top-28">
              <h2 className="mb-6 text-2xl font-semibold text-stone-900">
                Order Summary
              </h2>

              <div className="mb-6 rounded-[26px] border border-stone-200 bg-white p-5">
                <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
                  Silver Wallet
                </p>

                <h3 className="mt-2 text-3xl font-semibold text-stone-900">
                  {Number(userProfile?.silverWalletGrams ?? 0).toFixed(3)} g
                </h3>

                <p className="mt-2 text-sm text-stone-600">
                  1 gram = ₹{silverRate}
                </p>

                <div className="mt-4">
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Wallet mathi ketla grams use karva chhe?
                  </label>

                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    max={Number(userProfile?.silverWalletGrams ?? 0)}
                    value={walletGramsToUse}
                    onChange={(e) => setWalletGramsToUse(e.target.value)}
                    placeholder="Example: 5"
                    className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleUseFullWallet}
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm transition hover:bg-stone-100"
                  >
                    Use Full Wallet
                  </button>

                  <button
                    type="button"
                    onClick={handleClearWalletUse}
                    className="rounded-full border border-stone-300 px-4 py-2 text-sm transition hover:bg-stone-100"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-4 space-y-2 rounded-2xl bg-[#faf7f2] p-4 text-sm">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Available Wallet</span>
                    <span>
                      {Number(userProfile?.silverWalletGrams ?? 0).toFixed(3)} g
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600">
                    <span>Entered Wallet Use</span>
                    <span>{Number(walletGramsToUse || 0).toFixed(3)} g</span>
                  </div>

                  <div className="flex items-center justify-between font-medium text-green-700">
                    <span>Estimated Wallet Discount</span>
                    <span>
                      ₹{Number(estimatedWalletDiscount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
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
                      <span>Coupon Discount</span>
                      <span>- ₹{couponDiscount.toFixed(2)}</span>
                    </div>
                  </>
                )}

                {Number(estimatedWalletDiscount || 0) > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Wallet Discount</span>
                    <span>
                      - ₹{Number(estimatedWalletDiscount).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="py-6">
                <div className="mb-6 flex items-center justify-between text-stone-900">
                  <span className="text-base font-medium">
                    Estimated Final Total
                  </span>
                  <span className="text-2xl font-semibold">
                    ₹{Number(estimatedFinalTotal || 0).toFixed(2)}
                  </span>
                </div>

                {pricingPreview && (
                  <div className="mb-6 rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
                    <p>
                      Backend Wallet Used:{" "}
                      {Number(pricingPreview.walletGramsUsed || 0).toFixed(3)} g
                    </p>
                    <p className="mt-1">
                      Backend Wallet Discount: ₹
                      {Number(pricingPreview.walletDiscount || 0).toFixed(2)}
                    </p>
                    <p className="mt-1 font-medium text-stone-900">
                      Final Payable: ₹
                      {Number(pricingPreview.finalPayable || 0).toFixed(2)}
                    </p>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={paying || !selectedAddress}
                  className="w-full rounded-full bg-black px-6 py-3.5 text-sm font-medium tracking-[0.16em] text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {paying ? "PROCESSING..." : "COMPLETE CHECKOUT"}
                </button>

                <p className="mt-4 text-center text-xs leading-6 text-stone-500">
                  Secure Razorpay checkout with wallet and coupon support.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;