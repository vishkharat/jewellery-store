import { Link } from "react-router-dom";
import returnHero from "../assets/home-story-card-2.jpg";

function ReturnPolicy() {
  return (
    <div className="bg-[#fcfaf7] text-stone-900">
      {/* Hero */}
      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
              Return & Exchange Policy
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[58px]">
              Easy To Understand
              <br className="hidden sm:block" />
              Returns & Exchanges
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
              We want your shopping experience to feel smooth and trustworthy.
              Please review the details below to understand when returns or
              exchanges may be accepted and what conditions apply.
            </p>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-5">
            <img
              src={returnHero}
              alt="Return and exchange policy Aurum"
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
              Request Window
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Within 48 Hours
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Any issue should be reported within 48 hours of delivery for
              faster support.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Exchanges
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Eligible Cases Only
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Exchanges may be allowed depending on product condition and policy
              approval.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Damaged / Wrong Item
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Support Available
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              If you receive a damaged or incorrect product, please contact us
              immediately.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Condition
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Unused Only
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Items must be unused and returned in original condition and
              packaging.
            </p>
          </div>
        </div>
      </section>

      {/* Main Policy */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Return Requests
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                When You Can
                <br className="hidden sm:block" />
                Contact Us
              </h2>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                If you receive a damaged product, incorrect item, or experience
                a genuine issue with your order, you should contact us within 48
                hours of delivery. To help us review your request quickly,
                please share your order details along with clear photos or a
                short explanation of the issue.
              </p>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                Requests made after the allowed reporting window may not be
                eligible for review unless there is a special exception.
              </p>
            </div>

            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Exchange Requests
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Eligible Exchange
                <br className="hidden sm:block" />
                Conditions
              </h2>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                Exchanges may be considered depending on the nature of the
                request, the item condition, and the return inspection. Products
                must remain unused, undamaged, and in their original packaging
                with all included materials.
              </p>
              <p className="mt-5 text-sm leading-8 text-stone-600 sm:text-base">
                Once the returned item is reviewed and approved, an exchange or
                other suitable resolution may be processed depending on the
                case.
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
              Unused Condition
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Items should be unused, unaltered, and in the same condition as
              delivered.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6">
            <p className="text-lg font-semibold text-stone-900">
              Original Packaging
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Please keep original packaging, tags, and any supporting material
              safe until you fully inspect your order.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-lg font-semibold text-stone-900">
              Approval Based
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Returns and exchanges are reviewed case by case and are not
              automatically guaranteed.
            </p>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-6">
            <p className="text-lg font-semibold text-stone-900">
              Support Required
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Please contact our team before sending any item back so proper
              instructions can be provided.
            </p>
          </div>
        </div>
      </section>

      {/* Not Covered */}
      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-7xl rounded-[36px] border border-stone-200 bg-[#f8f2ea] p-7 sm:p-10 lg:p-12">
          <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
            Not Eligible
          </p>

          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
            Cases That May Not
            <br className="hidden sm:block" />
            Qualify For Return / Exchange
          </h2>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Used Products
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Items that show signs of wear, use, or damage after delivery may
                not be eligible.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Missing Packaging
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Products returned without original packaging or key materials may
                be declined.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Late Reporting
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Requests reported too late after delivery may not be considered
                under policy.
              </p>
            </div>

            <div className="rounded-[24px] bg-white p-5">
              <p className="text-base font-semibold text-stone-900">
                Unapproved Returns
              </p>
              <p className="mt-2 text-sm leading-7 text-stone-600">
                Items sent back without prior approval or communication may not
                be accepted.
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
                Need Assistance?
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
                Need Help With A
                <br className="hidden sm:block" />
                Return Or Exchange Request?
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">
                Contact our support team with your order details and we’ll guide
                you through the next steps.
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
                to="/orders"
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-stone-900"
              >
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReturnPolicy;