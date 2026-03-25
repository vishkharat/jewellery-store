import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getProductById,
  addToCartApi,
  addToWishlistApi,
  addProductReviewApi,
  getAllProducts,
} from "../services/api";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";
import ProductCard from "../components/ProductCard";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  const [selectedVariant, setSelectedVariant] = useState("");
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    rating: "",
    comment: "",
  });
  const [reviewLoading, setReviewLoading] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const data = await getProductById(id);
      setProduct(data);

      if (data.images && data.images.length > 0) {
        setSelectedImage(data.images[0].url);
      } else {
        setSelectedImage("");
      }

      if (data.variants && data.variants.length > 0) {
        setSelectedVariant(`${data.variants[0].name}: ${data.variants[0].value}`);
      } else {
        setSelectedVariant("");
      }

      const query = new URLSearchParams();
      if (data.category) query.append("category", data.category);

      const relatedData = await getAllProducts(query.toString());

      const filteredRelated =
        relatedData?.products
          ?.filter((item) => item._id !== data._id)
          .slice(0, 4) || [];

      setRelatedProducts(filteredRelated);
    } catch (error) {
      console.log("Error fetching product", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Pehla login karo");
        return;
      }

      let variantPayload = null;

      if (product.variants && product.variants.length > 0) {
        if (!selectedVariant) {
          toast.error("Please select a variant");
          return;
        }

        const [name, value] = selectedVariant
          .split(":")
          .map((item) => item.trim());

        variantPayload = {
          name,
          value,
        };
      }

      await addToCartApi(product._id, token, variantPayload);
      toast.success("Product cart ma add thai gayo");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Cart ma add nai thai shakyo");
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Pehla login karo");
        return;
      }

      await addToWishlistApi(product._id, token);
      toast.success("Product wishlist ma add thai gayo");
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Wishlist ma add nai thai shakyo"
      );
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Pehla login karo");
        return;
      }

      if (!reviewForm.rating || !reviewForm.comment.trim()) {
        toast.error("Rating ane comment banne bharvu jaruri chhe");
        return;
      }

      setReviewLoading(true);

      await addProductReviewApi(
        product._id,
        {
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        },
        token
      );

      toast.success("Review successfully add thai gayi");

      setReviewForm({
        rating: "",
        comment: "",
      });

      fetchProduct();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Review add nai thai shaki");
    } finally {
      setReviewLoading(false);
    }
  };

  const averageRatingText = useMemo(() => {
    if (!product) return "0.0";
    return Number(product.rating || 0).toFixed(1);
  }, [product]);

  const selectedVariantData = useMemo(() => {
    if (!product?.variants?.length || !selectedVariant) return null;

    const [name, value] = selectedVariant.split(":").map((item) => item.trim());

    return (
      product.variants.find(
        (variant) =>
          String(variant.name).trim() === name &&
          String(variant.value).trim() === value
      ) || null
    );
  }, [product, selectedVariant]);

  const activeStock = useMemo(() => {
    if (product?.variants?.length) {
      return selectedVariantData ? Number(selectedVariantData.stock || 0) : 0;
    }

    return Number(product?.stock || 0);
  }, [product, selectedVariantData]);

  const isPurchasable = useMemo(() => {
    if (product?.variants?.length) {
      return !!selectedVariantData && activeStock > 0;
    }

    return activeStock > 0;
  }, [product, selectedVariantData, activeStock]);

  const deliveryEstimate = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    const end = new Date(today);

    start.setDate(today.getDate() + 4);
    end.setDate(today.getDate() + 7);

    const formatDate = (date) =>
      date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });

    return `${formatDate(start)} - ${formatDate(end)}`;
  }, []);

  const handleImageZoom = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
    setIsZooming(true);
  };

  const resetImageZoom = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
    setIsZooming(false);
  };

  if (loading) {
    return (
      <div className="bg-[#fcfaf7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <Skeleton className="mb-4 h-[420px] w-full rounded-[32px]" />
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="mb-3 h-4 w-28" />
              <Skeleton className="mb-4 h-12 w-3/4" />
              <Skeleton className="mb-5 h-10 w-56" />
              <Skeleton className="mb-5 h-5 w-44" />

              <div className="mb-6 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              <div className="mb-6 flex flex-wrap gap-4">
                <Skeleton className="h-11 w-28 rounded-full" />
                <Skeleton className="h-11 w-28 rounded-full" />
                <Skeleton className="h-11 w-36 rounded-full" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
                <Skeleton className="h-24 w-full rounded-3xl" />
              </div>

              <div className="mt-6 flex gap-4">
                <Skeleton className="h-14 w-44 rounded-full" />
                <Skeleton className="h-14 w-44 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="py-20 text-center">Product not found</div>;
  }

  return (
    <div className="bg-[#fcfaf7] pb-28 lg:pb-0">
      <div className="px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Product Details
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            {/* Left Side - Premium Gallery */}
            <div>
              <div className="overflow-hidden rounded-[34px] border border-stone-200 bg-[#f4eee6] p-4 sm:p-5">
                <div
                  className="relative flex h-[380px] cursor-zoom-in items-center justify-center overflow-hidden rounded-[26px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:h-[460px] lg:h-[560px]"
                  onMouseMove={handleImageZoom}
                  onMouseLeave={resetImageZoom}
                >
                  {selectedImage ? (
                    <>
                      <img
                        src={selectedImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-200"
                        style={zoomStyle}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
                      <div className="absolute bottom-4 right-4 rounded-full bg-black/80 px-3 py-1 text-xs text-white">
                        {isZooming ? "Zooming..." : "Hover to zoom"}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-stone-400">
                      No Image
                    </div>
                  )}
                </div>
              </div>

              {product.images && product.images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImage(img.url)}
                      className={`overflow-hidden rounded-2xl border bg-white p-1.5 transition ${
                        selectedImage === img.url
                          ? "border-black shadow-md"
                          : "border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={`${product.name} ${index + 1}`}
                        className="h-20 w-full rounded-xl object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Product Details */}
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500 sm:text-xs">
                {product.type}
              </p>

              <h1 className="mb-4 text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[48px]">
                {product.name}
              </h1>

              {product.variants && product.variants.length > 0 && !selectedVariant && (
                <p className="mb-4 text-sm text-amber-700">
                  Variant select karvu jaruri chhe.
                </p>
              )}

              <div className="mb-6 flex flex-wrap items-end gap-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-stone-500">
                    Price
                  </p>

                  <div className="mt-1 flex items-center gap-3">
                    <p className="text-3xl font-semibold text-stone-900 sm:text-4xl">
                      ₹{product.price}
                    </p>

                    {Number(product.makingCharges || 0) > 0 && (
                      <span className="text-sm text-stone-400 line-through">
                        ₹{Number(product.price) + Number(product.makingCharges)}
                      </span>
                    )}
                  </div>
                </div>

                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-medium tracking-[0.18em] ${
                    isPurchasable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isPurchasable ? "IN STOCK" : "OUT OF STOCK"}
                </span>
              </div>

              <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-stone-600">
                <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                  ⭐ {averageRatingText} / 5
                </span>
                <span className="rounded-full border border-stone-200 bg-white px-4 py-2">
                  {product.numReviews || 0} Reviews
                </span>
                <span className="rounded-full border border-stone-200 bg-white px-4 py-2 capitalize">
                  {product.category}
                </span>
              </div>

              {product.variants && product.variants.length > 0 ? (
                selectedVariant ? (
                  activeStock > 0 && activeStock <= 5 ? (
                    <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                      Jaldi order karo — selected variant ma only {activeStock} piece(s) left chhe.
                    </div>
                  ) : activeStock === 0 ? (
                    <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                      Aa selected variant currently out of stock chhe.
                    </div>
                  ) : (
                    <div className="mb-6 rounded-2xl bg-white px-4 py-3 text-sm text-stone-600">
                      Selected variant stock: {activeStock}
                    </div>
                  )
                ) : (
                  <div className="mb-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    Add to Cart karta pahela variant select karo.
                  </div>
                )
              ) : activeStock > 0 && activeStock <= 5 ? (
                <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  Jaldi order karo — only {activeStock} piece(s) left in stock.
                </div>
              ) : null}

              <p className="mb-8 max-w-2xl text-base leading-8 text-stone-600">
                {product.description}
              </p>

              {/* Variant UI */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-8">
                  <p className="mb-3 text-sm font-medium text-stone-900">
                    Available Options
                  </p>

                  {selectedVariantData && (
                    <p className="mb-3 text-sm text-stone-600">
                      Selected:{" "}
                      <span className="font-medium text-stone-900">
                        {selectedVariantData.name} - {selectedVariantData.value}
                      </span>{" "}
                      • Stock:{" "}
                      <span
                        className={`font-medium ${
                          Number(selectedVariantData.stock) > 0
                            ? "text-green-700"
                            : "text-red-600"
                        }`}
                      >
                        {Number(selectedVariantData.stock)}
                      </span>
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((variant, index) => {
                      const label = `${variant.name}: ${variant.value}`;
                      const isSelected = selectedVariant === label;

                      return (
                        <button
                          key={variant._id || index}
                          type="button"
                          onClick={() => setSelectedVariant(label)}
                          className={`rounded-full border px-5 py-2.5 text-sm tracking-[0.16em] transition ${
                            isSelected
                              ? "border-black bg-black text-white"
                              : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {label}
                          {typeof variant.stock === "number"
                            ? ` • Stock ${variant.stock}`
                            : ""}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Product Info */}
              <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Metal
                  </p>
                  <p className="mt-2 text-lg font-medium capitalize text-stone-900">
                    {product.metal}
                  </p>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Weight
                  </p>
                  <p className="mt-2 text-lg font-medium text-stone-900">
                    {product.weight} g
                  </p>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Metal Weight
                  </p>
                  <p className="mt-2 text-lg font-medium text-stone-900">
                    {product.metalWeight ?? 0} g
                  </p>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Purity
                  </p>
                  <p className="mt-2 text-lg font-medium text-stone-900">
                    {product.purity ?? 0.925}
                  </p>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] sm:col-span-2 lg:col-span-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Making Charges
                  </p>
                  <p className="mt-2 text-lg font-medium text-stone-900">
                    ₹{product.makingCharges}
                  </p>
                </div>
              </div>

              {/* Trust / Highlights */}
              <div className="mb-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="text-sm font-semibold text-stone-900">
                    Premium Finish
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Elegant jewellery crafted with refined detailing for a luxury look.
                  </p>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="text-sm font-semibold text-stone-900">
                    Secure Packaging
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Carefully packed to ensure safe delivery and premium unboxing.
                  </p>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="text-sm font-semibold text-stone-900">
                    Easy Styling
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    Designed to complement both everyday looks and special occasions.
                  </p>
                </div>
              </div>

              {/* Delivery estimate */}
              <div className="mb-8 rounded-3xl border border-stone-200 bg-[#f8f2ea] p-5">
                <p className="text-sm font-semibold text-stone-900">
                  Estimated Delivery
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Order today and expected delivery between{" "}
                  <span className="font-medium text-stone-900">{deliveryEstimate}</span>.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="mb-10 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={handleAddToCart}
                  disabled={!isPurchasable}
                  className={`flex-1 rounded-full px-8 py-4 text-sm font-medium tracking-[0.18em] transition ${
                    !isPurchasable
                      ? "cursor-not-allowed bg-stone-400 text-white"
                      : "bg-black text-white hover:bg-stone-800"
                  }`}
                >
                  {!isPurchasable ? "OUT OF STOCK" : "ADD TO CART"}
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className="flex-1 rounded-full border border-stone-300 px-8 py-4 text-sm font-medium tracking-[0.18em] text-stone-700 transition hover:border-black hover:bg-black hover:text-white"
                >
                  ADD TO WISHLIST
                </button>
              </div>

              {/* Delivery / Return / Care */}
              <div className="space-y-4">
                <div className="rounded-3xl border border-stone-200 bg-white p-5">
                  <p className="font-semibold text-stone-900">
                    Delivery Information
                  </p>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    Estimated delivery timelines may vary by location. Orders are
                    packed carefully for a premium experience.
                  </p>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-5">
                  <p className="font-semibold text-stone-900">Return Guidance</p>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    Returns and exchanges can be managed as per store policy.
                    Product should remain in original condition for smoother support.
                  </p>
                </div>

                <div className="rounded-3xl border border-stone-200 bg-white p-5">
                  <p className="font-semibold text-stone-900">Care Tips</p>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    Keep jewellery dry, avoid perfume contact, and store separately
                    to maintain shine and finish for longer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury storytelling sections */}
          <div className="mt-16 grid gap-6 lg:mt-24 lg:grid-cols-3">
            <div className="rounded-[32px] border border-stone-200 bg-[#f8f2ea] p-8">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-500">
                Crafted Elegance
              </p>
              <h3 className="text-2xl font-semibold text-stone-900">
                Designed For Everyday Luxury
              </h3>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                Each piece is selected to balance elegance, comfort, and modern styling
                so it feels premium every single day.
              </p>
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-white p-8">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-500">
                Signature Finish
              </p>
              <h3 className="text-2xl font-semibold text-stone-900">
                Refined Details Matter
              </h3>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                From silhouette to polish, the final look is built to feel graceful,
                elevated, and gift-worthy from the first glance.
              </p>
            </div>

            <div className="rounded-[32px] border border-stone-200 bg-[#f8f2ea] p-8">
              <p className="mb-3 text-xs uppercase tracking-[0.3em] text-stone-500">
                Made To Be Loved
              </p>
              <h3 className="text-2xl font-semibold text-stone-900">
                Styling That Lasts
              </h3>
              <p className="mt-4 text-sm leading-7 text-stone-600">
                Whether layered with other pieces or worn solo, this jewellery is
                created to stay timeless in your collection.
              </p>
            </div>
          </div>

          {/* Reviews + Review Form */}
          <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left - Existing Reviews */}
            <div>
              <div className="mb-6">
                <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
                  Customer Feedback
                </p>
                <h2 className="text-3xl font-semibold text-stone-900 sm:text-4xl">
                  Reviews
                </h2>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-5">
                  {product.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-3xl border border-stone-200 bg-white p-6"
                    >
                      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-lg font-medium text-stone-900">
                          {review.name || "Customer"}
                        </h3>

                        <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                          ⭐ {review.rating} / 5
                        </span>
                      </div>

                      <p className="leading-7 text-stone-600">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-stone-200 bg-white py-12 text-center text-stone-600">
                  Aa product mate haju review nathi.
                </div>
              )}
            </div>

            {/* Right - Add Review */}
            <div>
              <div className="rounded-3xl border border-stone-200 bg-[#f8f2ea] p-6 sm:p-8">
                <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
                  Share Your Experience
                </p>
                <h2 className="mb-6 text-2xl font-semibold text-stone-900">
                  Write a Review
                </h2>

                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm text-stone-700">
                      Rating
                    </label>

                    <select
                      name="rating"
                      value={reviewForm.rating}
                      onChange={handleReviewChange}
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                      required
                    >
                      <option value="">Select rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-stone-700">
                      Comment
                    </label>

                    <textarea
                      name="comment"
                      value={reviewForm.comment}
                      onChange={handleReviewChange}
                      rows="5"
                      placeholder="Tamaro experience lakho..."
                      className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full rounded-full bg-black px-6 py-3 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                  >
                    {reviewLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16 lg:mt-24">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
                  More To Explore
                </p>
                <h2 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                  Related Products
                </h2>
              </div>

              <Link
                to="/products"
                className="text-sm font-medium text-stone-700 hover:text-black"
              >
                View All →
              </Link>
            </div>

            {relatedProducts.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-stone-200 bg-white py-12 text-center text-stone-600">
                Related products currently available nathi.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky CTA on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-stone-900">
              {product.name}
            </p>
            <p className="text-sm font-semibold text-stone-700">₹{product.price}</p>
          </div>

          <button
            onClick={handleAddToWishlist}
            className="rounded-full border border-stone-300 px-4 py-3 text-sm"
          >
            Wishlist
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!isPurchasable}
            className={`rounded-full px-5 py-3 text-sm text-white ${
              !isPurchasable ? "cursor-not-allowed bg-stone-400" : "bg-black"
            }`}
          >
            {!isPurchasable ? "Sold Out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;