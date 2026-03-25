import { Link } from "react-router-dom";
import { FiHeart } from "react-icons/fi";

function ProductCard({ product }) {
  const firstImage = product?.images?.[0]?.url || "";
  const hasDiscount =
    Number(product?.makingCharges || 0) > 0 && Number(product?.price || 0) > 0;

  return (
    <div className="group relative overflow-hidden rounded-[32px] border border-stone-200 bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_55px_rgba(0,0,0,0.08)]">
      {Number(product?.stock || 0) === 0 && (
        <span className="absolute left-4 top-4 z-20 rounded-full bg-red-500 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white shadow-sm">
          Out of Stock
        </span>
      )}

      {Number(product?.isFeatured) === 1 || product?.isFeatured === true ? (
        <span className="absolute left-4 top-14 z-20 rounded-full bg-stone-900 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white shadow-sm">
          Featured
        </span>
      ) : null}

      <button
        type="button"
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm backdrop-blur transition hover:bg-black hover:text-white"
      >
        <FiHeart size={16} />
      </button>

      <Link to={`/product/${product._id}`} className="block">
        <div className="relative h-64 w-full overflow-hidden bg-[#f7f1e8] sm:h-72 lg:h-[310px]">
          {firstImage ? (
            <>
              <img
                src={firstImage}
                alt={product?.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-60" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-sm uppercase tracking-[0.22em] text-stone-400">
              No Image
            </div>
          )}
        </div>
      </Link>

      <div className="p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
            {product?.category || "Premium Edit"}
          </p>

          {product?.metal && (
            <span className="rounded-full bg-[#f8f2ea] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-stone-700">
              {product.metal}
            </span>
          )}
        </div>

        <h3 className="line-clamp-1 text-lg font-semibold text-stone-900 sm:text-[19px]">
          {product?.name}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.16em] text-stone-500">
          {product?.type && <span>{product.type}</span>}
          {product?.weight ? <span>• {product.weight} g</span> : null}
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">
              Price
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl font-semibold text-black">
                ₹{product?.price}
              </span>

              {hasDiscount ? (
                <span className="text-sm text-stone-400 line-through">
                  ₹{Number(product.price) + Number(product.makingCharges)}
                </span>
              ) : null}
            </div>
          </div>

          <Link
            to={`/product/${product._id}`}
            className="rounded-full border border-stone-300 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-700 transition hover:border-black hover:bg-black hover:text-white"
          >
            View Product
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;