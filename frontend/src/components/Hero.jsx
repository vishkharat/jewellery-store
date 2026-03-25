import { Link } from "react-router-dom";
import heroBanner from "../assets/hero-banner.jpeg";
import heroMain from "../assets/hero-main.jpg";
import heroTexture from "../assets/hero-texture.jpg";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#f8f3ec]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.9),transparent_35%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6">
        <div className="overflow-hidden rounded-[24px] border border-stone-200 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
          <img
            src={heroBanner}
            alt="Aurum premium luxury jewellery banner"
            className="h-16 w-full object-cover sm:h-20 lg:h-24"
          />
        </div>
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        {/* Left */}
        <div className="text-center lg:text-left">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-stone-500 sm:text-sm">
            Everyday Luxury Jewellery
          </p>

          <h1 className="mb-6 text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Jewellery That
            <br className="hidden sm:block" />
            Feels Effortlessly Premium
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-base leading-8 text-stone-600 sm:text-lg lg:mx-0">
            Discover refined rings, necklaces, bracelets, and earrings designed
            to elevate everyday styling with a timeless, modern luxury feel.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              to="/products"
              className="rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Shop Collection
            </Link>

            <Link
              to="/products?sort=latest"
              className="rounded-full border border-stone-300 bg-white px-8 py-4 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
            >
              New Arrivals
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-stone-200 bg-white/80 p-5 backdrop-blur">
              <p className="text-2xl font-semibold text-stone-900">Premium</p>
              <p className="mt-2 text-sm text-stone-600">
                Elegant pieces for elevated everyday wear
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white/80 p-5 backdrop-blur">
              <p className="text-2xl font-semibold text-stone-900">
                Gift-Worthy
              </p>
              <p className="mt-2 text-sm text-stone-600">
                Beautiful styles curated for special moments
              </p>
            </div>

            <div className="rounded-3xl border border-stone-200 bg-white/80 p-5 backdrop-blur">
              <p className="text-2xl font-semibold text-stone-900">Modern</p>
              <p className="mt-2 text-sm text-stone-600">
                Clean silhouettes that stay timeless in your collection
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-[300px] w-[300px] rounded-full bg-stone-200/70 blur-2xl sm:h-[360px] sm:w-[360px] lg:h-[420px] lg:w-[420px]" />

          <div className="relative grid w-full max-w-[520px] gap-5">
            {/* Main image card */}
            <div className="ml-auto w-[82%] rounded-[36px] border border-stone-200 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
              <div className="relative overflow-hidden rounded-[28px] bg-[#efe7dc]">
                <img
                  src={heroMain}
                  alt="Premium gold jewellery hero visual"
                  className="h-[260px] w-full object-cover sm:h-[320px] lg:h-[360px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/80">
                    Signature Collection
                  </p>
                  <p className="mt-2 text-lg font-medium">
                    Premium Jewellery Visual
                  </p>
                </div>
              </div>
            </div>

            {/* Small support card */}
            <div className="mr-auto w-[68%] overflow-hidden rounded-[32px] border border-stone-200 bg-[#faf7f2] shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
              <img
                src={heroTexture}
                alt="Luxury ring texture background"
                className="h-40 w-full object-cover"
              />

              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  Best For
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-stone-900">
                  Layering, gifting, and everyday elegance
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">
                  Curated pieces that pair beautifully across daily looks and
                  occasion styling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;