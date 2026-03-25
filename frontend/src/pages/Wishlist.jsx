import { useEffect, useMemo, useState } from "react";
import {
  getWishlistItemsApi,
  removeWishlistItemApi,
  addToCartApi,
} from "../services/api";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";
import PageHeaderSkeleton from "../components/PageHeaderSkeleton";
import { Link } from "react-router-dom";

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalItems = useMemo(() => wishlistItems.length, [wishlistItems]);

  const fetchWishlistItems = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getWishlistItemsApi(token);
      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const handleRemove = async (wishlistItemId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      await removeWishlistItemApi(wishlistItemId, token);
      toast.success("Item removed from wishlist");
      fetchWishlistItems();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  const handleMoveToCart = async (productId, wishlistItemId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      await addToCartApi(productId, token);
      await removeWishlistItemApi(wishlistItemId, token);

      toast.success("Item moved to cart");
      fetchWishlistItems();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to move item");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fcfaf7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <PageHeaderSkeleton />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[30px] border border-stone-200 bg-white p-4"
              >
                <Skeleton className="mb-4 h-72 w-full rounded-[24px]" />
                <Skeleton className="mb-3 h-6 w-2/3" />
                <Skeleton className="mb-3 h-4 w-1/3" />
                <Skeleton className="mb-5 h-5 w-20" />
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-28 rounded-full" />
                  <Skeleton className="h-10 w-24 rounded-full" />
                </div>
              </div>
            ))}
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
                Saved For Later
              </p>
              <h1 className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[46px]">
                Wishlist
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
                Jewellery pieces you’ve saved to revisit, gift, or style later.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                Saved Items
              </p>
              <p className="mt-2 text-2xl font-semibold text-stone-900">
                {totalItems}
              </p>
            </div>
          </div>
        </section>

        {wishlistItems.length === 0 ? (
          <div className="rounded-[32px] border border-stone-200 bg-white py-16 text-center text-stone-600">
            <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
              Wishlist Empty
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-stone-900">
              Your wishlist is empty
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">
              Save your favourite jewellery pieces to revisit them later.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <div
                key={item._id}
                className="group rounded-[30px] border border-stone-200 bg-white p-4 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
              >
                <div className="mb-4 overflow-hidden rounded-[24px] bg-[#f7f2eb]">
                  {item.product?.images && item.product.images.length > 0 ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-72 items-center justify-center text-stone-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                    {item.product?.category || "Premium Edit"}
                  </p>

                  {item.product?.metal && (
                    <span className="rounded-full bg-[#f8f2ea] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-stone-700">
                      {item.product.metal}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-semibold text-stone-900">
                  {item.product?.name}
                </h2>

                <p className="mt-2 text-sm capitalize text-stone-500">
                  {item.product?.type}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-lg font-semibold text-stone-900">
                    ₹{item.product?.price}
                  </p>

                  {Number(item.product?.stock || 0) > 0 ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      In Stock
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleMoveToCart(item.product._id, item._id)}
                    className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    Move to Cart
                  </button>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;