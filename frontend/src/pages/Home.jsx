import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import ProductCard from "../components/ProductCard";
import { getFeaturedProducts, getAllProducts } from "../services/api";
import Skeleton from "../components/Skeleton";
import homeStoryMain from "../assets/home-story-main.jpg";
import homeStoryCard1 from "../assets/home-story-card-1.jpg";
import homeStoryCard2 from "../assets/home-story-card-2.jpg";
import homeStoryCard3 from "../assets/home-story-card-3.jpg";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        const [featuredData, latestData] = await Promise.all([
          getFeaturedProducts(),
          getAllProducts("sort=latest"),
        ]);

        setFeaturedProducts(
          Array.isArray(featuredData) ? featuredData.slice(0, 4) : []
        );
        setLatestProducts(
          latestData?.products ? latestData.products.slice(0, 4) : []
        );
      } catch (error) {
        console.log("Error fetching home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="bg-[#fcfaf7] text-stone-900">
      <Hero />

      <CategorySection />

      {/* Luxury Intro Strip */}
      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-[34px] border border-stone-200 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:grid-cols-3 sm:p-7">
          <div className="rounded-[24px] bg-[#f8f2ea] px-5 py-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">
              Everyday Elegance
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900 sm:text-xl">
              Light, refined pieces for daily styling
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Clean silhouettes designed to feel luxurious without being heavy
              or overdone.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#fcfaf7] px-5 py-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">
              Gifting Ready
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900 sm:text-xl">
              Jewellery chosen for memorable moments
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Perfect for birthdays, celebrations, self-gifting, and elegant
              keepsake moments.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#f8f2ea] px-5 py-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-stone-500">
              Premium Aesthetic
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900 sm:text-xl">
              Minimal design with a luxury-first feel
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              A polished jewellery experience inspired by modern feminine
              luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-stone-500 sm:text-xs">
                Signature Edit
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[42px]">
                Pieces That Define
                <br className="hidden sm:block" />
                The Aurum Aesthetic
              </h2>
            </div>

            <div className="lg:text-right">
              <p className="max-w-xl text-sm leading-7 text-stone-600">
                Discover standout jewellery curated for refined layering,
                elevated everyday looks, and thoughtful gifting.
              </p>

              <Link
                to="/products"
                className="mt-5 inline-block rounded-full border border-stone-300 px-6 py-3 text-sm font-medium text-stone-900 transition hover:border-black hover:bg-black hover:text-white"
              >
                View All Jewellery
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] border border-stone-200 bg-white p-4"
                >
                  <Skeleton className="h-72 w-full rounded-[22px]" />
                  <Skeleton className="mt-4 h-5 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-1/3" />
                  <Skeleton className="mt-4 h-5 w-20" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-stone-200 bg-white py-12 text-center text-stone-600">
              Featured products currently available nathi.
            </div>
          )}
        </div>
      </section>

      {/* Editorial / Story */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-[#f3ece2] p-5 sm:p-7">
            <div className="relative min-h-[320px] overflow-hidden rounded-[28px] bg-white sm:min-h-[420px]">
              <img
                src={homeStoryMain}
                alt="Brand story jewellery visual"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              <div className="relative flex min-h-[320px] flex-col justify-between p-6 text-white sm:min-h-[420px] sm:p-8">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.35em] text-white/80">
                    Brand Story
                  </p>
                  <h3 className="mt-4 max-w-xl text-3xl font-semibold leading-tight sm:text-4xl">
                    Jewellery For
                    <br />
                    Modern Everyday Luxury
                  </h3>
                </div>

                <p className="max-w-md text-sm leading-8 text-white/90">
                  Our collections are created for women who love clean styling,
                  soft statement pieces, and jewellery that feels premium from
                  day to night.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="overflow-hidden rounded-[30px] border border-stone-200 bg-white">
              <div className="grid md:grid-cols-[0.95fr_1.05fr]">
                <div className="h-60 md:h-full">
                  <img
                    src={homeStoryCard1}
                    alt="Why Aurum jewellery visual"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-7">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-stone-500">
                    Why Aurum
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-stone-900 sm:text-3xl">
                    Minimal, feminine, polished
                  </h3>
                  <p className="mt-4 text-sm leading-8 text-stone-600">
                    Every product page, every collection, and every design
                    choice is built to feel elegant, elevated, and easy to wear.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-[#faf7f2]">
                <img
                  src={homeStoryCard2}
                  alt="Stack beautifully jewellery visual"
                  className="h-48 w-full object-cover"
                />

                <div className="p-6">
                  <p className="text-lg font-semibold text-stone-900">
                    Stack Beautifully
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    Wear pieces solo for subtle elegance or layer them for a
                    more styled luxury look.
                  </p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-stone-200 bg-[#faf7f2]">
                <img
                  src={homeStoryCard3}
                  alt="Gift with ease jewellery visual"
                  className="h-48 w-full object-cover"
                />

                <div className="p-6">
                  <p className="text-lg font-semibold text-stone-900">
                    Gift With Ease
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    Timeless jewellery that feels special for birthdays,
                    anniversaries, and meaningful self-gifting.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Arrivals */}
      <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-stone-500 sm:text-xs">
                New Arrivals
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[42px]">
                Fresh Pieces For
                <br className="hidden sm:block" />
                Your Next Jewellery Edit
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-stone-600 lg:text-right">
              Explore our latest drops curated for statement gifting, refined
              styling, and a premium modern wardrobe.
            </p>
          </div>

          {loading ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] border border-stone-200 bg-white p-4"
                >
                  <Skeleton className="h-72 w-full rounded-[22px]" />
                  <Skeleton className="mt-4 h-5 w-3/4" />
                  <Skeleton className="mt-3 h-4 w-1/3" />
                  <Skeleton className="mt-4 h-5 w-20" />
                </div>
              ))}
            </div>
          ) : latestProducts.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {latestProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-stone-200 bg-[#faf7f2] py-12 text-center text-stone-600">
              Latest products currently available nathi.
            </div>
          )}
        </div>
      </section>

      {/* Promise Section */}
      <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-[#f8f2ea] p-7 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-stone-500">
                The Aurum Promise
              </p>
              <h2 className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[42px]">
                Refined Jewellery,
                <br className="hidden sm:block" />
                Designed To Feel Special
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
                From everyday styling staples to beautiful gifting picks, our
                collections are built around elegance, wearability, and a
                premium shopping experience.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-white p-5">
                <p className="text-base font-semibold text-stone-900">
                  Elegant Styling
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Lightweight pieces that pair beautifully with both casual and
                  occasion looks.
                </p>
              </div>

              <div className="rounded-[24px] bg-white p-5">
                <p className="text-base font-semibold text-stone-900">
                  Gift-Worthy Feel
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  A curated collection made to feel thoughtful, polished, and
                  memorable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-stone-200 bg-stone-900 px-7 py-10 text-white sm:px-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-stone-300">
                Gift Edit
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
                Find A Piece That
                <br className="hidden sm:block" />
                Feels Instantly Special
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">
                Explore jewellery curated for birthdays, celebrations, elegant
                milestones, and beautiful everyday self-gifting moments.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-full bg-white px-7 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
              >
                Shop Collection
              </Link>

              <Link
                to="/products?sort=latest"
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-stone-900"
              >
                Explore New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;