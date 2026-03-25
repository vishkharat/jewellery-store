import { NavLink } from "react-router-dom";

function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `block rounded-2xl px-4 py-3 text-sm transition ${
      isActive
        ? "bg-black text-white shadow-md"
        : "text-stone-700 hover:bg-stone-100"
    }`;

  return (
    <aside className="w-full rounded-[30px] border border-stone-200 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] lg:w-64">
      <p className="mb-2 text-[11px] uppercase tracking-[0.35em] text-stone-500">
        Admin Panel
      </p>

      <h2 className="mb-5 text-2xl font-semibold text-stone-900">
        AURUM Control
      </h2>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <NavLink to="/admin" end className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/admin/products/add" className={linkClass}>
          Add Product
        </NavLink>

        <NavLink to="/admin/orders" className={linkClass}>
          Orders
        </NavLink>

        <NavLink to="/admin/coupons" className={linkClass}>
          Coupons
        </NavLink>

        <NavLink to="/admin/exchanges" className={linkClass}>
          Exchanges
        </NavLink>

        <NavLink to="/admin/contact-messages" className={linkClass}>
          Contact Messages
        </NavLink>

        <NavLink to="/admin/newsletter-subscribers" className={linkClass}>
          Newsletter Subscribers
        </NavLink>
      </div>

      <div className="mt-6 rounded-[24px] border border-stone-200 bg-[#faf7f2] p-4">
        <p className="text-sm font-semibold text-stone-900">
          Premium Store Admin
        </p>
        <p className="mt-2 text-xs leading-6 text-stone-600">
          Manage products, orders, pricing, coupons, exchanges, customer
          inquiries, and newsletter subscribers from one premium admin
          workspace.
        </p>
      </div>
    </aside>
  );
}

export default AdminSidebar;