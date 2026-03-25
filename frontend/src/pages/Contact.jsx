import { useState } from "react";
import toast from "react-hot-toast";
import { submitContactFormApi } from "../services/api";
import contactHero from "../assets/home-story-main.jpg";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await submitContactFormApi(formData);

      toast.success("Message sent successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to send message"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fcfaf7] text-stone-900">
      <section className="px-4 py-12 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
              Contact Aurum
            </p>

            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[58px]">
              We’d Love To
              <br className="hidden sm:block" />
              Hear From You
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
              Whether you have a question about an order, a product, gifting, or
              anything related to your jewellery shopping experience, our team
              is here to help.
            </p>
          </div>

          <div className="overflow-hidden rounded-[36px] border border-stone-200 bg-white p-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-5">
            <img
              src={contactHero}
              alt="Contact Aurum"
              className="h-[320px] w-full rounded-[28px] object-cover sm:h-[420px] lg:h-[520px]"
            />
          </div>
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 sm:pb-12 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-[26px] border border-stone-200 bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Email
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              support@aurum.com
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              For orders, product queries, and support requests.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Phone
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              +91 98765 43210
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Available for customer assistance during support hours.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Working Hours
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              Mon - Sat
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              10:00 AM to 7:00 PM for customer support and assistance.
            </p>
          </div>

          <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-stone-500">
              Location
            </p>
            <h3 className="mt-3 text-lg font-semibold text-stone-900">
              India
            </h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">
              Serving customers with a premium online jewellery experience.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8">
            <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
              Send Us A Message
            </p>

            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Get In Touch
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
              Fill in your details below and we’ll get back to you as soon as
              possible.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-stone-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-stone-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-stone-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-stone-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Enter subject"
                    className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm text-stone-700">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Write your message"
                  className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-black px-8 py-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="space-y-5">
            <div className="rounded-[30px] border border-stone-200 bg-[#f8f2ea] p-7">
              <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Customer Support
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-stone-900">
                We’re Here To Help
              </h3>
              <p className="mt-4 text-sm leading-8 text-stone-600">
                From product details to delivery questions, our team is ready to
                assist you throughout your jewellery shopping journey.
              </p>
            </div>

            <div className="rounded-[30px] border border-stone-200 bg-white p-7">
              <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Order Support
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-stone-900">
                Need Help With An Order?
              </h3>
              <p className="mt-4 text-sm leading-8 text-stone-600">
                Please mention your order details while contacting us so we can
                assist you faster with your request.
              </p>
            </div>

            <div className="rounded-[30px] border border-stone-200 bg-[#f8f2ea] p-7">
              <p className="text-[11px] uppercase tracking-[0.34em] text-stone-500">
                Gifting Queries
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-stone-900">
                Shopping For Someone Special?
              </h3>
              <p className="mt-4 text-sm leading-8 text-stone-600">
                Reach out for guidance on premium gifting choices and elegant
                styles that make the moment memorable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 pt-8 sm:px-6 lg:px-10 lg:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-stone-200 bg-stone-900 px-7 py-10 text-white sm:px-10 sm:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-stone-300">
                Aurum Support
              </p>
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[44px]">
                Let’s Make Your
                <br className="hidden sm:block" />
                Jewellery Experience Better
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-stone-300 sm:text-base">
                Reach out anytime for product support, order guidance, or help
                choosing the right piece.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:support@aurum.com"
                className="rounded-full bg-white px-7 py-3 text-sm font-medium text-stone-900 transition hover:bg-stone-100"
              >
                Email Us
              </a>

              <a
                href="tel:+919876543210"
                className="rounded-full border border-white/30 px-7 py-3 text-sm font-medium text-white transition hover:bg-white hover:text-stone-900"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;