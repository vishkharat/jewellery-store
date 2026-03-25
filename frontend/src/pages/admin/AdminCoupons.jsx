import { useEffect, useState } from "react";
import {
  createCouponApi,
  getCouponsApi,
  updateCouponApi,
  deleteCouponApi,
} from "../../services/api";
import toast from "react-hot-toast";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    expiryDate: "",
  });

  const [creating, setCreating] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getCouponsApi(token);
      setCoupons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching coupons", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "",
      expiryDate: "",
    });
    setEditingCouponId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      setCreating(true);

      if (editingCouponId) {
        await updateCouponApi(editingCouponId, formData, token);
        toast.success("Coupon updated successfully");
      } else {
        await createCouponApi(formData, token);
        toast.success("Coupon created successfully");
      }

      resetForm();
      fetchCoupons();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to save coupon");
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCouponId(coupon._id);
    setFormData({
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || "",
      minOrderAmount: coupon.minOrderAmount || "",
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate).toISOString().split("T")[0]
        : "",
    });
  };

  const handleDelete = async (couponId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this coupon?"
      );

      if (!confirmDelete) return;

      await deleteCouponApi(couponId, token);
      toast.success("Coupon deleted successfully");

      if (editingCouponId === couponId) {
        resetForm();
      }

      fetchCoupons();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete coupon");
    }
  };

  if (loading) {
    return <div className="text-lg text-stone-600">Loading coupons...</div>;
  }

  return (
    <div>
      <section className="mb-8 rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
          Admin Coupons
        </p>
        <h1 className="text-4xl font-semibold text-stone-900">
          Manage Coupons
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          Create discount campaigns, manage expiry dates, and control active
          coupon offers for your store.
        </p>
      </section>

      <div className="mb-10 rounded-[30px] border border-stone-200 bg-[#faf7f2] p-6">
        <h2 className="mb-6 text-2xl font-semibold text-stone-900">
          {editingCouponId ? "Edit Coupon" : "Create Coupon"}
        </h2>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-stone-700">
              Coupon Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g. SAVE10"
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-700">
              Discount Type
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-700">
              Discount Value
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-700">
              Minimum Order Amount
            </label>
            <input
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleChange}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div className="lg:col-span-2">
            <label className="mb-2 block text-sm text-stone-700">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div className="lg:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="rounded-full bg-black px-8 py-3 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {creating
                ? editingCouponId
                  ? "Updating..."
                  : "Creating..."
                : editingCouponId
                ? "Update Coupon"
                : "Create Coupon"}
            </button>

            {editingCouponId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-stone-300 px-8 py-3 transition hover:bg-stone-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-semibold text-stone-900">
          Existing Coupons
        </h2>

        {coupons.length === 0 ? (
          <div className="rounded-[30px] border border-stone-200 bg-white py-16 text-center text-stone-600">
            No coupons found.
          </div>
        ) : (
          <div className="space-y-4">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className="rounded-[30px] border border-stone-200 bg-white p-5 transition duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
              >
                <div className="grid gap-4 md:grid-cols-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Code</p>
                    <p className="mt-1 font-semibold text-stone-900">
                      {coupon.code}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Type</p>
                    <p className="mt-1 capitalize text-stone-900">
                      {coupon.discountType}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Value</p>
                    <p className="mt-1 text-stone-900">{coupon.discountValue}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Min Order</p>
                    <p className="mt-1 text-stone-900">₹{coupon.minOrderAmount}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Expires</p>
                    <p className="mt-1 text-stone-900">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      coupon.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {coupon.isActive ? "Active" : "Inactive"}
                  </span>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="rounded-full border border-stone-300 px-5 py-2 text-sm transition hover:bg-stone-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="rounded-full bg-red-500 px-5 py-2 text-sm text-white transition hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCoupons;