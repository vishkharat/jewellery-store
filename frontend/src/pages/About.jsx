import { Link } from "react-router-dom";
import aboutHero from "../assets/home-story-main.jpg";
import aboutDetailOne from "../assets/home-story-card-1.jpg";
import aboutDetailTwo from "../assets/home-story-card-2.jpg";

function About() {
  return (
    <div className="bg-[#fcfaf7] text-stone-900">
      {/* Hero Section */}
      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
              About Aurum
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[58px]">
              Jewellery Designed
              <br className="hidden sm:block" />
              For Everyday Luxury
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
              Aurum is built around the idea that jewellery should feel elegant,
              wearable, and meaningful — not only for occasions, but for the
              everyday moments that define personal style.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/products"
                className="rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-stone-800"
              >
                Shop Collection
              </Link>

              <Link
                to="/contact"
                className="rounded-full border border-stone-300 bg-white px-8 py-4 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
              >
                Contact Us
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-5">
            <img
              src={aboutHero}
              alt="Aurum jewellery brand story"
              className="h-[320px] w-full rounded-[28px] object-cover sm:h-[420px] lg:h-[520px]"
            />
          </div>
        </div>
      </section>

      {/* Brand Intro Strip */}
      <section className="px-4 pb-10 sm:px-6 sm:pb-12 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-[34px] border border-stone-200 bg-white p-5 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:grid-cols-3 sm:p-7">
          <div className="rounded-[24px] bg-[#f8f2ea] px-5 py-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Elegant
            </p>
            <h3 className="mt-3 text-xl font-semibold text-stone-900">
              Minimal Yet Elevated
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Pieces created to feel graceful, polished, and effortless across
              both casual and occasion wear.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#fcfaf7] px-5 py-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Meaningful
            </p>
            <h3 className="mt-3 text-xl font-semibold text-stone-900">
              Made For Real Moments
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Whether self-gifting or celebrating someone special, our jewellery
              is designed to carry emotion and memory.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#f8f2ea] px-5 py-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Modern
            </p>
            <h3 className="mt-3 text-xl font-semibold text-stone-900">
              Timeless Everyday Style
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Clean silhouettes, premium finishes, and versatile styling that
              stay relevant across seasons and trends.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="overflow-hidden rounded-[34px] border border-stone-200 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <img
              src={aboutDetailOne}
              alt="Aurum story detail"
              className="h-[300px] w-full rounded-[26px] object-cover sm:h-[380px] lg:h-[460px]"
            />
          </div>

          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
              Our Story
            </p>

            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
              A Jewellery Brand Built
              <br className="hidden sm:block" />
              Around Refined Simplicity
            </h2>

            <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
              Aurum was created with a simple vision: to make jewellery feel
              premium, feminine, and easy to style in everyday life. We believe
              that luxury does not always need to be loud — sometimes it is
              expressed through clean shapes, elegant finishes, and thoughtful
              details.
            </p>

            <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
              From gifting moments to daily wear, our collections are curated to
              help women express their personality with confidence, softness,
              and timeless taste.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-[#f8f2ea] p-7 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.95fr] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Our Philosophy
              </p>

              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
                Luxury Should Feel
                <br className="hidden sm:block" />
                Beautifully Wearable
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
                We focus on jewellery that feels special without feeling
                difficult to wear. Every collection is selected around balance:
                premium yet comfortable, statement-worthy yet refined, modern
                yet timeless.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] bg-white p-5">
                <p className="text-base font-semibold text-stone-900">
                  Everyday Styling
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Pieces made to move easily from day looks to evening elegance.
                </p>
              </div>

              <div className="rounded-[24px] bg-white p-5">
                <p className="text-base font-semibold text-stone-900">
                  Gift-Worthy Design
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Jewellery that feels thoughtful, memorable, and instantly
                  special.
                </p>
              </div>

              <div className="rounded-[24px] bg-white p-5">
                <p className="text-base font-semibold text-stone-900">
                  Premium Finish
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Carefully chosen aesthetics that create a polished luxury
                  impression.
                </p>
              </div>

              <div className="rounded-[24px] bg-white p-5">
                <p className="text-base font-semibold text-stone-900">
                  Timeless Appeal
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600">
                  Styles designed to remain elegant beyond fast-moving trends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual + Promise */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="overflow-hidden rounded-[34px] border border-stone-200 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <img
              src={aboutDetailTwo}
              alt="Aurum premium visual"
              className="h-[300px] w-full rounded-[26px] object-cover sm:h-[380px] lg:h-[460px]"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
              The Aurum Promise
            </p>

            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
              Built To Feel Elegant
              <br className="hidden sm:block" />
              From First Click To Final Look
            </h2>

            <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
              Our goal is not just to sell jewellery — it is to create a premium
              shopping experience that feels smooth, beautiful, and trustworthy.
              From the way products are presented to the way they are selected
              and styled, every detail is designed to reflect care and quality.
            </p>

            <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
              Aurum stands for refined femininity, modern luxury, and jewellery
              that becomes part of everyday self-expression.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-stone-200 bg-stone-900 px-7 py-10 text-white sm:px-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-stone-300">
                Explore Aurum
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
                Discover Jewellery
                <br className="hidden sm:block" />
                With A Premium Everyday Feel
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">
                Explore rings, necklaces, bracelets, and earrings curated for
                elegant styling, gifting, and timeless wear.
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
                to="/contact"
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-stone-900"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;