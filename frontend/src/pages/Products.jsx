import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getAllProducts } from "../services/api";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import PageHeaderSkeleton from "../components/PageHeaderSkeleton";

function Products() {
  const [searchParams] = useSearchParams();
  const searchKeyword = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [metal, setMetal] = useState("");
  const [sort, setSort] = useState("");

  const fetchAllProducts = async () => {
    try {
      setLoading(true);

      const query = new URLSearchParams();

      if (searchKeyword) query.append("keyword", searchKeyword);
      if (category) query.append("category", category);
      if (type) query.append("type", type);
      if (metal) query.append("metal", metal);
      if (sort) query.append("sort", sort);

      const data = await getAllProducts(query.toString());
      setProducts(data.products || []);
    } catch (error) {
      console.log("Error fetching all products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, [category, type, metal, sort, searchKeyword]);

  const resultLabel = useMemo(() => {
    if (loading) return "Loading...";
    return `${products.length} Product${products.length !== 1 ? "s" : ""}`;
  }, [products, loading]);

  const hasActiveFilters =
    Boolean(searchKeyword) || Boolean(category) || Boolean(type) || Boolean(metal) || Boolean(sort);

  const clearAllFilters = () => {
    setCategory("");
    setType("");
    setMetal("");
    setSort("");
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {loading ? (
          <div>
            <PageHeaderSkeleton />

            <div className="mb-10 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="space-y-4">
                <div className="h-5 w-32 animate-pulse rounded-full bg-stone-200" />
                <div className="h-12 w-72 animate-pulse rounded-2xl bg-stone-200" />
                <div className="h-4 w-full max-w-2xl animate-pulse rounded-full bg-stone-200" />
              </div>

              <div className="h-10 w-36 animate-pulse rounded-full bg-stone-200" />
            </div>

            <div className="mb-10 rounded-[30px] border border-stone-200 bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <div className="h-11 w-40 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-11 w-32 animate-pulse rounded-full bg-stone-200" />
                  <div className="h-11 w-32 animate-pulse rounded-full bg-stone-200" />
                </div>

                <div className="h-11 w-44 animate-pulse rounded-full bg-stone-200" />
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <section className="mb-8 rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8 lg:p-10">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                    Our Collection
                  </p>

                  <h1 className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[46px]">
                    Shop Jewellery
                    <br className="hidden sm:block" />
                    With A Premium Feel
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
                    Discover elegant rings, necklaces, bracelets, earrings, and
                    refined statement pieces curated for modern everyday luxury.
                  </p>

                  {searchKeyword && (
                    <p className="mt-4 text-sm text-stone-700">
                      Search results for{" "}
                      <span className="font-semibold">“{searchKeyword}”</span>
                    </p>
                  )}
                </div>

                <div className="lg:text-right">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                    Results
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-stone-900">
                    {resultLabel}
                  </p>
                </div>
              </div>
            </section>

            {/* Filter Bar */}
            <section className="mb-8 rounded-[32px] border border-stone-200 bg-[#f8f2ea] p-5 sm:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-black"
                  >
                    <option value="">Category</option>
                    <option value="demi-fine jewellery">Demi Fine</option>
                    <option value="9kt gold jewellery">9KT Gold</option>
                  </select>

                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-black"
                  >
                    <option value="">Type</option>
                    <option value="ring">Ring</option>
                    <option value="necklace">Necklace</option>
                    <option value="bracelet">Bracelet</option>
                    <option value="earring">Earring</option>
                    <option value="chain">Chain</option>
                  </select>

                  <select
                    value={metal}
                    onChange={(e) => setMetal(e.target.value)}
                    className="rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-black"
                  >
                    <option value="">Metal</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="diamond">Diamond</option>
                  </select>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-full border border-stone-300 bg-white px-4 py-3 text-sm text-stone-700 outline-none transition focus:border-black"
                  >
                    <option value="">Sort</option>
                    <option value="price">Price Low → High</option>
                    <option value="-price">Price High → Low</option>
                    <option value="latest">Latest</option>
                    <option value="bestseller">Best Seller</option>
                  </select>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="rounded-full border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 transition hover:border-black hover:bg-black hover:text-white"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Applied filters */}
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {searchKeyword ? (
                    <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-stone-700">
                      Search: {searchKeyword}
                    </span>
                  ) : null}

                  {category ? (
                    <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-stone-700">
                      {category}
                    </span>
                  ) : null}

                  {type ? (
                    <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-stone-700">
                      {type}
                    </span>
                  ) : null}

                  {metal ? (
                    <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-stone-700">
                      {metal}
                    </span>
                  ) : null}

                  {sort ? (
                    <span className="rounded-full bg-white px-4 py-2 text-xs uppercase tracking-[0.14em] text-stone-700">
                      Sort: {sort}
                    </span>
                  ) : null}
                </div>
              )}
            </section>

            {/* Empty state */}
            {products.length === 0 ? (
              <div className="rounded-[34px] border border-stone-200 bg-white px-6 py-16 text-center">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                  No Match Found
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-stone-900">
                  No products found
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-stone-600">
                  Try changing your search or filters to explore more jewellery
                  from our collection.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-6 rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Products;