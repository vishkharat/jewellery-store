import { useEffect, useMemo, useState } from "react";
import {
  getAdminDashboardApi,
  getMonthlySalesApi,
  getTopProductsApi,
} from "../../services/api";
import Skeleton from "../../components/Skeleton";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const [statsData, salesData, topProductsData] = await Promise.all([
        getAdminDashboardApi(token),
        getMonthlySalesApi(token),
        getTopProductsApi(token),
      ]);

      setStats(statsData || null);
      setMonthlySales(Array.isArray(salesData) ? salesData : []);
      setTopProducts(Array.isArray(topProductsData) ? topProductsData : []);
    } catch (error) {
      console.log("Error fetching admin dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const revenueText = useMemo(() => {
    return Number(stats?.totalRevenue || 0).toLocaleString("en-IN");
  }, [stats]);

  if (loading) {
    return (
      <div>
        <div className="mb-8 rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)]">
          <Skeleton className="mb-3 h-4 w-32" />
          <Skeleton className="h-10 w-64" />
        </div>

        <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[28px] border border-stone-200 bg-white p-6"
            >
              <Skeleton className="mb-3 h-4 w-24" />
              <Skeleton className="h-10 w-20" />
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[30px] border border-stone-200 bg-white p-6">
            <Skeleton className="mb-6 h-8 w-40" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-stone-200 bg-white p-6">
            <Skeleton className="mb-6 h-8 w-48" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-20 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-[30px] border border-stone-200 bg-white py-16 text-center text-lg text-stone-600">
        No dashboard data found.
      </div>
    );
  }

  return (
    <div>
      <section className="mb-8 rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
              Admin Overview
            </p>
            <h1 className="text-4xl font-semibold text-stone-900">
              Dashboard
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
              View store performance, monitor orders and customers, and track
              your top-selling products from one polished admin dashboard.
            </p>
          </div>

          <div className="rounded-[24px] bg-[#f8f2ea] px-5 py-4 lg:text-right">
            <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              Revenue Snapshot
            </p>
            <p className="mt-2 text-2xl font-semibold text-stone-900">
              ₹{revenueText}
            </p>
          </div>
        </div>
      </section>

      <div className="mb-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] border border-stone-200 bg-[#f8f2ea] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
            Total Orders
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-stone-900">
            {stats.totalOrders}
          </h2>
        </div>

        <div className="rounded-[28px] border border-stone-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
            Total Products
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-stone-900">
            {stats.totalProducts}
          </h2>
        </div>

        <div className="rounded-[28px] border border-stone-200 bg-[#f8f2ea] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
            Total Customers
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-stone-900">
            {stats.totalCustomers}
          </h2>
        </div>

        <div className="rounded-[28px] border border-stone-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]">
          <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
            Total Revenue
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-stone-900">
            ₹{revenueText}
          </h2>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[30px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-stone-500">
              Performance
            </p>
            <h2 className="text-2xl font-semibold text-stone-900">
              Monthly Sales
            </h2>
          </div>

          {monthlySales.length === 0 ? (
            <div className="rounded-[22px] bg-[#fcfaf7] py-10 text-center text-stone-500">
              No sales data available.
            </div>
          ) : (
            <div className="space-y-4">
              {monthlySales.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-[20px] bg-[#fcfaf7] px-4 py-4 transition hover:bg-[#f5efe6]"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Month
                    </p>
                    <p className="mt-1 font-medium text-stone-900">
                      {item._id?.month}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Revenue
                    </p>
                    <p className="mt-1 font-medium text-stone-900">
                      ₹{item.revenue}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Orders
                    </p>
                    <p className="mt-1 font-medium text-stone-900">
                      {item.orders}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[30px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
          <div className="mb-6">
            <p className="mb-2 text-xs uppercase tracking-[0.22em] text-stone-500">
              Bestseller View
            </p>
            <h2 className="text-2xl font-semibold text-stone-900">
              Top Selling Products
            </h2>
          </div>

          {topProducts.length === 0 ? (
            <div className="rounded-[22px] bg-[#fcfaf7] py-10 text-center text-stone-500">
              No top products found.
            </div>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center gap-4 rounded-[20px] bg-[#fcfaf7] p-4 transition hover:bg-[#f5efe6]"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-stone-100">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-stone-400">
                        No Img
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-stone-900">
                      {product.name}
                    </h3>
                    <p className="text-sm capitalize text-stone-500">
                      {product.type}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Sold
                    </p>
                    <p className="mt-1 font-semibold text-stone-900">
                      {product.sold}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;