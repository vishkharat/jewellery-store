import { Link } from "react-router-dom";
import termsHero from "../assets/home-story-card-2.jpg";

function Terms() {
  return (
    <div className="bg-[#fcfaf7] text-stone-900">
      {/* Hero */}
      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
              Terms & Conditions
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[58px]">
              Terms For Using
              <br className="hidden sm:block" />
              The Aurum Store
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
              These Terms & Conditions explain the rules, responsibilities, and
              general terms that apply when you browse, shop, or place an order
              through Aurum.
            </p>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-5">
            <img
              src={termsHero}
              alt="Aurum terms and conditions"
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
              Website Use
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Responsible Access
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              By using the website, you agree to browse and shop responsibly
              under these terms.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Orders
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Subject To Acceptance
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Orders are subject to availability, payment confirmation, and
              successful processing.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Pricing
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              May Change
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Product prices, offers, and availability may change without prior
              notice.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Support
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Contact Available
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Customers may contact us for order, support, policy, or website
              related questions.
            </p>
          </div>
        </div>
      </section>

      {/* Main Terms */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Website Usage
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Using Our Website
                <br className="hidden sm:block" />
                And Services
              </h2>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                By accessing or using the Aurum website, you agree to use it for
                lawful browsing, product discovery, account management, and
                purchases only. You should not misuse the site, attempt
                unauthorized access, or perform actions that disrupt store
                operations.
              </p>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                We reserve the right to update, modify, or discontinue parts of
                the website, services, or features without prior notice whenever
                needed for operational or business reasons.
              </p>
            </div>

            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Orders & Acceptance
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Placing An Order
                <br className="hidden sm:block" />
                With Aurum
              </h2>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                When you place an order, it is considered a request to purchase
                a product. Orders are accepted only after payment confirmation,
                product availability review, and successful processing. In some
                cases, an order may need to be cancelled or adjusted due to
                stock issues, pricing errors, or operational concerns.
              </p>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                We may contact you if any issue arises regarding your order or
                delivery information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Cards */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[28px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-lg font-semibold text-stone-900">
              Product Information
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              We aim to keep descriptions, prices, images, and details as
              accurate as possible, but minor variations may occur.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6">
            <p className="text-lg font-semibold text-stone-900">
              Pricing & Offers
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Product prices, discounts, and promotional offers may be revised,
              updated, or withdrawn at any time.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-lg font-semibold text-stone-900">
              Account Responsibility
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Users are responsible for maintaining accurate account details,
              addresses, and login-related information.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6">
            <p className="text-lg font-semibold text-stone-900">
              Payment Confirmation
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Orders are processed only after successful payment confirmation or
              approved checkout flow.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Terms */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-[#f8f2ea] p-7 sm:p-10 lg:p-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
            Additional Conditions
          </p>

          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
            Important Terms To
            <br className="hidden sm:block" />
            Keep In Mind
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Shipping & Delivery
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Shipping timelines are estimates and may vary based on courier,
                location, and business conditions.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Returns & Exchanges
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Returns or exchanges are subject to the store’s separate return
                and exchange policy.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Website Changes
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                We may modify site content, policies, collection details, and
                services from time to time as needed.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Policy Updates
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                These terms may be updated periodically, and continued use of
                the website implies acceptance of the latest version.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-stone-200 bg-stone-900 px-7 py-10 text-white sm:px-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-stone-300">
                Need Clarification?
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
                Questions About Our
                <br className="hidden sm:block" />
                Terms Or Policies?
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">
                Contact us if you need help understanding store rules, orders,
                policies, or support processes.
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
                to="/privacy-policy"
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-stone-900"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Terms;