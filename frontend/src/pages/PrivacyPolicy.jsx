import { Link } from "react-router-dom";
import privacyHero from "../assets/home-story-card-1.jpg";

function PrivacyPolicy() {
  return (
    <div className="bg-[#fcfaf7] text-stone-900">
      {/* Hero */}
      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
              Privacy Policy
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[58px]">
              Your Information,
              <br className="hidden sm:block" />
              Handled With Care
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
              We value your trust. This Privacy Policy explains what
              information we collect, how we use it, and how your data is
              handled while you shop with Aurum.
            </p>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-5">
            <img
              src={privacyHero}
              alt="Aurum privacy policy"
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
              Account Data
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Name, Email, Phone
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              We collect basic account and contact details required for store
              operations.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Order Information
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Shipping & Order Use
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              We use your details to process orders, deliveries, and customer
              support.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Payment Safety
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Secure Processing
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Payment transactions are handled through integrated secure payment
              services.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Support
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Contact Anytime
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              You may contact us anytime if you have privacy or data-related
              concerns.
            </p>
          </div>
        </div>
      </section>

      {/* Main Privacy Content */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Information We Collect
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Data You Share
                <br className="hidden sm:block" />
                With Us
              </h2>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                When you create an account, place an order, save an address,
                contact us, or interact with our website, we may collect your
                name, email address, phone number, shipping address, order
                details, and contact form information.
              </p>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                This information helps us provide customer service, process
                orders, maintain your account, and improve your shopping
                experience.
              </p>
            </div>

            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                How We Use It
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Why Your Data
                <br className="hidden sm:block" />
                Is Needed
              </h2>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                Your information is used to process purchases, confirm orders,
                manage deliveries, provide customer support, respond to
                inquiries, and maintain account-related services such as profile,
                wishlist, cart, and order history.
              </p>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                We may also use certain information to improve our product
                presentation, service quality, and overall store experience.
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
              Order Processing
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Your order and shipping details are used only to fulfill your
              purchase and assist with related support.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6">
            <p className="text-lg font-semibold text-stone-900">
              Contact Requests
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Information submitted through the contact form is used only to
              respond to your inquiry and provide support.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-lg font-semibold text-stone-900">
              Payment Information
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Payment details are processed through secure payment partners. We
              do not store sensitive card details on our servers.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6">
            <p className="text-lg font-semibold text-stone-900">
              Account Information
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Saved account data helps us provide easier logins, order history,
              saved addresses, and a smoother shopping experience.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Points */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-[#f8f2ea] p-7 sm:p-10 lg:p-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
            Additional Privacy Notes
          </p>

          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
            Important Things To
            <br className="hidden sm:block" />
            Keep In Mind
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Limited Use
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                We use customer information only for business operations,
                support, order handling, and store service improvements.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                No Sensitive Card Storage
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Sensitive payment details are not intended to be stored directly
                within our application database.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Service Providers
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Certain services such as payment gateways, courier partners, or
                email tools may process limited information needed to perform
                their functions.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Contact Us
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                If you have questions about how your data is handled, you may
                contact us through the support page anytime.
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
                Privacy Support
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
                Have Questions About
                <br className="hidden sm:block" />
                Your Information?
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">
                Reach out to us if you need support related to account details,
                privacy concerns, or general store assistance.
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
                to="/about"
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-stone-900"
              >
                About Aurum
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;