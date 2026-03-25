import { Link } from "react-router-dom";
import shippingHero from "../assets/home-story-card-1.jpg";

function ShippingPolicy() {
  return (
    <div className="bg-[#fcfaf7] text-stone-900">
      {/* Hero */}
      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
              Shipping Policy
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[58px]">
              Shipping Information
              <br className="hidden sm:block" />
              For Your Order
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
              We aim to make your shopping experience smooth, transparent, and
              reliable. Below is everything you need to know about order
              processing, dispatch timelines, shipping charges, and delivery.
            </p>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-5">
            <img
              src={shippingHero}
              alt="Shipping policy Aurum"
              className="h-[320px] w-full rounded-[28px] object-cover sm:h-[420px] lg:h-[520px]"
            />
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="px-4 pb-10 sm:px-6 sm:pb-12 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[26px] border border-stone-200 bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Processing
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              1 - 3 Business Days
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Orders are usually processed and prepared within 1 to 3 business
              days.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Delivery
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              3 - 7 Business Days
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Delivery timelines may vary depending on your location and courier
              service.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Tracking
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Status Updates
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Once shipped, order progress can be tracked through your order
              timeline.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Support
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Help Available
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Reach out to us anytime for assistance related to delivery or
              shipping concerns.
            </p>
          </div>
        </div>
      </section>

      {/* Detailed Policy */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Order Processing
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                When Your Order
                <br className="hidden sm:block" />
                Gets Prepared
              </h2>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                Once your order is placed successfully, it enters our processing
                workflow. Most orders are processed within 1 to 3 business days.
                This includes payment confirmation, quality checks, packaging,
                and shipping preparation.
              </p>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                Orders placed on weekends or public holidays may begin
                processing on the next working day.
              </p>
            </div>

            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Shipping Timeline
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Estimated Delivery
                <br className="hidden sm:block" />
                After Dispatch
              </h2>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                After dispatch, delivery usually takes around 3 to 7 business
                days depending on your city, courier availability, and service
                conditions.
              </p>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                Some remote locations may take additional time. During festive
                seasons, sale periods, or unexpected courier delays, shipping
                timelines may be slightly extended.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Cards */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-lg font-semibold text-stone-900">
              Shipping Charges
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Shipping charges, if applicable, will be clearly shown during
              checkout before you complete your purchase.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6">
            <p className="text-lg font-semibold text-stone-900">
              Incorrect Address
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Please ensure that your delivery address and phone number are
              entered correctly to avoid delays or failed delivery attempts.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-lg font-semibold text-stone-900">
              Delayed Delivery
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Delivery delays caused by courier issues, weather, festivals, or
              regional disruptions may occur and are sometimes outside our
              direct control.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6">
            <p className="text-lg font-semibold text-stone-900">
              Order Tracking
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Once dispatched, your order status will reflect shipping updates,
              so you can stay informed throughout the journey.
            </p>
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-[#f8f2ea] p-7 sm:p-10 lg:p-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
            Important Notes
          </p>

          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
            Please Keep These
            <br className="hidden sm:block" />
            Shipping Points In Mind
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Business Days Only
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Processing and shipping timelines are generally counted in
                business days only.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Public Holidays
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Orders may take additional time during national holidays,
                festive seasons, and peak sale periods.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Delivery Attempts
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Please ensure someone is available to receive the package at the
                given delivery address.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Support Assistance
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                If your order seems delayed unusually, contact us and we will
                assist you with the latest update.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-stone-200 bg-stone-900 px-7 py-10 text-white sm:px-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-stone-300">
                Need Help?
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
                Questions About
                <br className="hidden sm:block" />
                Shipping Or Delivery?
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">
                Reach out to us for order-related delivery support, shipping
                clarifications, or general assistance.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="rounded-full bg-white px-7 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
              >
                Contact Us
              </Link>

              <Link
                to="/products"
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-stone-900"
              >
                Shop Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ShippingPolicy;