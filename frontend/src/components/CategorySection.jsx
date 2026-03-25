import { Link } from "react-router-dom";
import ring from "../assets/ring.jpg";
import necklace from "../assets/necklace.jpg";
import bracelet from "../assets/bracelet.jpg";
import earring from "../assets/earring.jpg";

const categories = [
  {
    id: 1,
    name: "Rings",
    subtitle: "Elegant silhouettes for everyday luxury",
    image: ring,
    query: "type=ring",
  },
  {
    id: 2,
    name: "Necklaces",
    subtitle: "Layered styles with a graceful finish",
    image: necklace,
    query: "type=necklace",
  },
  {
    id: 3,
    name: "Bracelets",
    subtitle: "Minimal designs with premium detail",
    image: bracelet,
    query: "type=bracelet",
  },
  {
    id: 4,
    name: "Earrings",
    subtitle: "Statement essentials for modern styling",
    image: earring,
    query: "type=earring",
  },
];

function CategorySection() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-stone-500 sm:text-sm">
              Shop By Category
            </p>

            <h2 className="text-3xl font-semibold text-stone-900 sm:text-4xl">
              Curated For Every Style Mood
            </h2>
          </div>

          <p className="max-w-xl text-sm leading-7 text-stone-600">
            Explore collections thoughtfully selected for gifting, layering, and
            timeless daily wear.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?${category.query}`}
              className="group overflow-hidden rounded-[30px] border border-stone-200 bg-[#faf7f2] p-4 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)] sm:p-5"
            >
              <div className="mb-5 overflow-hidden rounded-[24px] bg-stone-200">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <p className="mb-2 text-xs uppercase tracking-[0.28em] text-stone-500">
                Signature Edit
              </p>

              <h3 className="mb-2 text-xl font-medium text-stone-900">
                {category.name}
              </h3>

              <p className="text-sm leading-7 text-stone-600">
                {category.subtitle}
              </p>

              <div className="mt-5 text-sm font-medium text-stone-900">
                Explore Collection →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;