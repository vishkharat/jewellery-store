import { useEffect, useState } from "react";
import { getAllOrdersApi, updateOrderStatusApi } from "../../services/api";
import toast from "react-hot-toast";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [formState, setFormState] = useState({});

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getAllOrdersApi(token);
      const finalOrders = Array.isArray(data) ? data : [];

      setOrders(finalOrders);

      const initialFormState = {};
      finalOrders.forEach((order) => {
        initialFormState[order._id] = {
          status: order.status || "Order Placed",
          courierName: order.shippingDetails?.courierName || "",
          trackingNumber: order.shippingDetails?.trackingNumber || "",
          estimatedDelivery: order.shippingDetails?.estimatedDelivery
            ? new Date(order.shippingDetails.estimatedDelivery)
                .toISOString()
                .split("T")[0]
            : "",
          shippingNote: order.shippingDetails?.shippingNote || "",
        };
      });

      setFormState(initialFormState);
    } catch (error) {
      console.log("Error fetching admin orders", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleFieldChange = (orderId, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value,
      },
    }));
  };

  const handleSaveOrderUpdate = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const payload = formState[orderId];

      if (!payload?.status) {
        toast.error("Please select status");
        return;
      }

      if (
        payload.status === "Shipped" &&
        (!payload.courierName.trim() || !payload.trackingNumber.trim())
      ) {
        toast.error(
          "Courier name and tracking number are required for shipped status"
        );
        return;
      }

      setSavingId(orderId);

      await updateOrderStatusApi(
        orderId,
        {
          status: payload.status,
          courierName: payload.courierName,
          trackingNumber: payload.trackingNumber,
          estimatedDelivery: payload.estimatedDelivery || null,
          shippingNote: payload.shippingNote,
        },
        token
      );

      toast.success("Order updated successfully");
      await fetchOrders();
    } catch (error) {
      console.log("Admin order update error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update order status"
      );
    } finally {
      setSavingId("");
    }
  };

  if (loading) {
    return <div className="text-lg text-stone-600">Loading orders...</div>;
  }

  return (
    <div>
      <section className="mb-8 rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
          Admin Orders
        </p>
        <h1 className="text-4xl font-semibold text-stone-900">
          Manage Orders
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          Review customer orders, update fulfillment status, and manage manual
          shipping details from one clean operational workspace.
        </p>
      </section>

      {orders.length === 0 ? (
        <div className="rounded-[30px] border border-stone-200 bg-[#faf7f2] py-16 text-center text-stone-600">
          No orders found.
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const currentForm = formState[order._id] || {
              status: order.status || "Order Placed",
              courierName: "",
              trackingNumber: "",
              estimatedDelivery: "",
              shippingNote: "",
            };

            return (
              <div
                key={order._id}
                className="rounded-[30px] border border-stone-200 bg-white p-6 transition duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
              >
                <div className="mb-6 grid gap-4 border-b border-stone-200 pb-4 md:grid-cols-4">
                  <div className="rounded-[20px] bg-[#faf7f2] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Order ID
                    </p>
                    <p className="mt-2 break-all font-medium text-stone-900">
                      {order._id}
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-[#faf7f2] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Customer
                    </p>
                    <p className="mt-2 font-medium text-stone-900">
                      {order.user?.name || "N/A"}
                    </p>
                    <p className="mt-1 text-sm text-stone-500">
                      {order.user?.email || ""}
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-[#faf7f2] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Total
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-stone-900">
                      ₹{order.totalPrice}
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-[#faf7f2] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Current Status
                    </p>
                    <p className="mt-2 font-medium text-stone-900">
                      {order.status}
                    </p>
                  </div>
                </div>

                <div className="mb-6 rounded-[24px] border border-stone-200 bg-[#fcfaf7] p-5">
                  <h3 className="mb-4 text-lg font-semibold text-stone-900">
                    Update Order & Shipping
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        Status
                      </label>
                      <select
                        value={currentForm.status}
                        onChange={(e) =>
                          handleFieldChange(order._id, "status", e.target.value)
                        }
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                      >
                        <option value="Order Placed">Order Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        Courier Name
                      </label>
                      <input
                        type="text"
                        value={currentForm.courierName}
                        onChange={(e) =>
                          handleFieldChange(
                            order._id,
                            "courierName",
                            e.target.value
                          )
                        }
                        placeholder="Example: Delhivery"
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        value={currentForm.trackingNumber}
                        onChange={(e) =>
                          handleFieldChange(
                            order._id,
                            "trackingNumber",
                            e.target.value
                          )
                        }
                        placeholder="Example: DL123456789IN"
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        Estimated Delivery
                      </label>
                      <input
                        type="date"
                        value={currentForm.estimatedDelivery}
                        onChange={(e) =>
                          handleFieldChange(
                            order._id,
                            "estimatedDelivery",
                            e.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-medium text-stone-700">
                        Shipping Note
                      </label>
                      <textarea
                        rows="3"
                        value={currentForm.shippingNote}
                        onChange={(e) =>
                          handleFieldChange(
                            order._id,
                            "shippingNote",
                            e.target.value
                          )
                        }
                        placeholder="Example: Handle with care"
                        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={() => handleSaveOrderUpdate(order._id)}
                      disabled={savingId === order._id}
                      className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                    >
                      {savingId === order._id ? "Saving..." : "Save Update"}
                    </button>
                  </div>
                </div>

                <div className="mb-6 rounded-[24px] border border-stone-200 bg-[#faf7f2] p-5">
                  <h3 className="mb-3 text-lg font-semibold text-stone-900">
                    Current Shipping Details
                  </h3>

                  <div className="grid gap-3 md:grid-cols-2">
                    <p className="text-sm text-stone-700">
                      <span className="font-medium text-stone-900">
                        Courier:
                      </span>{" "}
                      {order.shippingDetails?.courierName || "-"}
                    </p>

                    <p className="text-sm text-stone-700">
                      <span className="font-medium text-stone-900">
                        Tracking Number:
                      </span>{" "}
                      {order.shippingDetails?.trackingNumber || "-"}
                    </p>

                    <p className="text-sm text-stone-700">
                      <span className="font-medium text-stone-900">
                        Shipped At:
                      </span>{" "}
                      {order.shippingDetails?.shippedAt
                        ? new Date(order.shippingDetails.shippedAt).toLocaleString()
                        : "-"}
                    </p>

                    <p className="text-sm text-stone-700">
                      <span className="font-medium text-stone-900">
                        Estimated Delivery:
                      </span>{" "}
                      {order.shippingDetails?.estimatedDelivery
                        ? new Date(
                            order.shippingDetails.estimatedDelivery
                          ).toLocaleDateString()
                        : "-"}
                    </p>

                    <div className="md:col-span-2">
                      <p className="text-sm text-stone-700">
                        <span className="font-medium text-stone-900">
                          Note:
                        </span>{" "}
                        {order.shippingDetails?.shippingNote || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col gap-4 rounded-[24px] border border-stone-200 p-4 transition hover:bg-[#fcfbf9] sm:flex-row sm:items-center"
                    >
                      <div className="h-24 w-full overflow-hidden rounded-[20px] bg-[#f7f2eb] sm:w-24">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-stone-400">
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <h2 className="text-lg font-medium text-stone-900">
                          {item.product?.name || "Product"}
                        </h2>

                        {item?.selectedVariant?.name &&
                          item?.selectedVariant?.value && (
                            <p className="mt-1 text-sm text-stone-500">
                              Variant: {item.selectedVariant.name} -{" "}
                              {item.selectedVariant.value}
                            </p>
                          )}

                        <p className="mt-1 text-sm text-stone-500">
                          Quantity: {item.quantity}
                        </p>

                        <p className="mt-2 text-sm text-stone-600">
                          Price: ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {order.shippingAddress && (
                  <div className="mt-6 rounded-[24px] border border-stone-200 bg-[#faf7f2] p-5">
                    <h3 className="mb-3 text-lg font-semibold text-stone-900">
                      Shipping Address
                    </h3>
                    <p className="text-sm text-stone-700">
                      {order.shippingAddress.fullName}
                    </p>
                    <p className="mt-1 text-sm text-stone-600">
                      {order.shippingAddress.phone}
                    </p>
                    <p className="mt-2 text-sm text-stone-600">
                      {order.shippingAddress.addressLine}
                    </p>
                    <p className="text-sm text-stone-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                    <p className="text-sm text-stone-600">
                      {order.shippingAddress.postalCode},{" "}
                      {order.shippingAddress.country}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminOrders;