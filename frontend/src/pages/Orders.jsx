import { useEffect, useMemo, useState } from "react";
import {
  getMyOrdersApi,
  createExchangeRequestApi,
  downloadInvoiceApi,
  cancelMyOrderApi,
} from "../services/api";
import Skeleton from "../components/Skeleton";
import PageHeaderSkeleton from "../components/PageHeaderSkeleton";
import toast from "react-hot-toast";

const steps = [
  "Order Placed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const CUSTOMER_CANCELLABLE_STATUS = ["Order Placed", "Processing"];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [selectedExchangeItem, setSelectedExchangeItem] = useState(null);
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState("");

  const [exchangeForm, setExchangeForm] = useState({
    requestQuantity: 1,
    reason: "",
    customerNote: "",
  });

  const totalOrders = useMemo(() => orders.length, [orders]);
  const deliveredOrders = useMemo(
    () => orders.filter((order) => order?.status === "Delivered").length,
    [orders]
  );

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getMyOrdersApi(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching orders", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getCurrentStepIndex = (status) => {
    const index = steps.indexOf(status);
    return index === -1 ? 0 : index;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-stone-100 text-stone-700";
      case "Processing":
        return "bg-amber-100 text-amber-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Out for Delivery":
        return "bg-purple-100 text-purple-700";
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  const openExchangeModal = (order, item) => {
    setSelectedExchangeItem({ order, item });
    setExchangeForm({
      requestQuantity: 1,
      reason: "",
      customerNote: "",
    });
    setShowExchangeModal(true);
  };

  const closeExchangeModal = () => {
    setShowExchangeModal(false);
    setSelectedExchangeItem(null);
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      if (!selectedExchangeItem) {
        toast.error("No item selected");
        return;
      }

      if (!exchangeForm.reason.trim()) {
        toast.error("Please enter reason");
        return;
      }

      setExchangeLoading(true);

      const { order, item } = selectedExchangeItem;

      const payload = {
        orderId: order._id,
        productId: item.product?._id,
        requestQuantity: Number(exchangeForm.requestQuantity),
        reason: exchangeForm.reason,
        customerNote: exchangeForm.customerNote,
        selectedVariant:
          item.selectedVariant?.name && item.selectedVariant?.value
            ? {
                name: item.selectedVariant.name,
                value: item.selectedVariant.value,
              }
            : null,
      };

      await createExchangeRequestApi(payload, token);

      toast.success("Exchange request submitted successfully");
      closeExchangeModal();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to submit exchange request"
      );
    } finally {
      setExchangeLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      setDownloadingInvoiceId(orderId);

      const blob = await downloadInvoiceApi(orderId, token);

      const fileUrl = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", `invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(fileUrl);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.log("Invoice download error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to download invoice"
      );
    } finally {
      setDownloadingInvoiceId("");
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const confirmed = window.confirm(
        "Are you sure you want to cancel this order?"
      );

      if (!confirmed) return;

      setCancellingOrderId(orderId);

      const response = await cancelMyOrderApi(orderId, token);

      toast.success(response?.message || "Order cancelled successfully");
      await fetchOrders();
    } catch (error) {
      console.log("Cancel order error:", error);
      toast.error(
        error?.response?.data?.message || "Failed to cancel order"
      );
    } finally {
      setCancellingOrderId("");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#fcfaf7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <PageHeaderSkeleton />

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-stone-200 bg-white p-5"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-4 h-10 w-28" />
              </div>
            ))}
          </div>

          <div className="space-y-10">
            {Array.from({ length: 2 }).map((_, orderIndex) => (
              <div
                key={orderIndex}
                className="rounded-[32px] border border-stone-200 bg-white p-6"
              >
                <div className="mb-6 grid gap-4 border-b border-stone-200 pb-4 md:grid-cols-3">
                  <Skeleton className="h-16 w-full rounded-[20px]" />
                  <Skeleton className="h-16 w-full rounded-[20px]" />
                  <Skeleton className="h-16 w-full rounded-[20px]" />
                </div>

                <div className="mb-8 flex gap-3 overflow-hidden">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-16 flex-1 rounded-[20px]"
                    />
                  ))}
                </div>

                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex flex-col gap-4 rounded-[24px] border border-stone-200 p-4 sm:flex-row sm:items-center"
                    >
                      <Skeleton className="h-24 w-full rounded-[20px] sm:w-24" />
                      <div className="flex-1">
                        <Skeleton className="mb-3 h-5 w-1/2" />
                        <Skeleton className="mb-2 h-4 w-28" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!localStorage.getItem("token")) {
    return <div className="py-20 text-center text-lg">Please login first</div>;
  }

  return (
    <>
      <div className="bg-[#fcfaf7] px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <section className="mb-8 rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="mb-3 text-[11px] uppercase tracking-[0.34em] text-stone-500">
                  Your Orders
                </p>
                <h1 className="text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl lg:text-[46px]">
                  Order History
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
                  Track your jewellery orders, review delivery progress, cancel
                  eligible orders, request exchange for delivered items,
                  download invoice anytime, and check shipping details directly
                  from your order page.
                </p>
              </div>

              <div className="lg:text-right">
                <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
                  Overview
                </p>
                <p className="mt-2 text-2xl font-semibold text-stone-900">
                  {totalOrders} Order{totalOrders !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </section>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                Total Orders
              </p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">
                {totalOrders}
              </p>
            </div>

            <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                Delivered
              </p>
              <p className="mt-3 text-3xl font-semibold text-stone-900">
                {deliveredOrders}
              </p>
            </div>

            <div className="rounded-[28px] border border-stone-200 bg-[#f8f2ea] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                Exchange Support
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-700">
                Delivered orders par direct exchange request muki shako cho.
              </p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="rounded-[32px] border border-stone-200 bg-white py-16 text-center text-stone-600">
              No orders found.
            </div>
          ) : (
            <div className="space-y-10">
              {orders.map((order) => {
                const currentStep = getCurrentStepIndex(order?.status);
                const isCancelled = order?.status === "Cancelled";
                const canCancel = CUSTOMER_CANCELLABLE_STATUS.includes(
                  order?.status
                );

                return (
                  <div
                    key={order?._id}
                    className="rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition duration-300 hover:shadow-[0_18px_45px_rgba(0,0,0,0.05)] sm:p-8"
                  >
                    <div className="mb-6 grid gap-4 border-b border-stone-200 pb-5 md:grid-cols-3">
                      <div className="rounded-[24px] bg-[#fcfaf7] p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
                          Order ID
                        </p>
                        <p className="mt-2 break-all font-medium text-stone-900">
                          {order?._id}
                        </p>
                      </div>

                      <div className="rounded-[24px] bg-[#fcfaf7] p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
                          Total
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-stone-900">
                          ₹{order?.totalPrice || 0}
                        </p>
                      </div>

                      <div className="rounded-[24px] bg-[#fcfaf7] p-4">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-stone-500">
                          Status
                        </p>
                        <div className="mt-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(
                              order?.status
                            )}`}
                          >
                            {order?.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleDownloadInvoice(order._id)}
                        disabled={downloadingInvoiceId === order._id}
                        className="rounded-full border border-black px-5 py-2.5 text-sm font-medium text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-400 disabled:hover:bg-transparent disabled:hover:text-stone-400"
                      >
                        {downloadingInvoiceId === order._id
                          ? "Downloading..."
                          : "Download Invoice"}
                      </button>

                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingOrderId === order._id}
                          className="rounded-full border border-red-500 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-400 disabled:hover:bg-transparent disabled:hover:text-stone-400"
                        >
                          {cancellingOrderId === order._id
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}
                    </div>

                    {!isCancelled && (
                      <div className="mb-8 overflow-x-auto">
                        <div className="flex min-w-[700px] items-start justify-between gap-4">
                          {steps.map((step, index) => {
                            const isCompleted = index <= currentStep;
                            const isLast = index === steps.length - 1;

                            return (
                              <div
                                key={step}
                                className="flex flex-1 items-center"
                              >
                                <div className="flex flex-col items-center">
                                  <div
                                    className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium transition-all duration-300 ${
                                      isCompleted
                                        ? "scale-100 bg-black text-white shadow-md"
                                        : "bg-stone-200 text-stone-500"
                                    }`}
                                  >
                                    {index + 1}
                                  </div>

                                  <p
                                    className={`mt-3 text-center text-xs transition ${
                                      isCompleted
                                        ? "font-medium text-stone-900"
                                        : "text-stone-500"
                                    }`}
                                  >
                                    {step}
                                  </p>
                                </div>

                                {!isLast && (
                                  <div
                                    className={`mx-3 mb-6 h-[3px] flex-1 rounded-full transition-all duration-300 ${
                                      index < currentStep
                                        ? "bg-black"
                                        : "bg-stone-200"
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {isCancelled && (
                      <div className="mb-8 rounded-[20px] bg-red-50 px-4 py-3 text-sm text-red-600">
                        This order has been cancelled.
                      </div>
                    )}

                    <div className="space-y-4">
                      {(order?.orderItems || []).map((item, index) => (
                        <div
                          key={item?._id || index}
                          className="flex flex-col gap-4 rounded-[24px] border border-stone-200 p-4 transition duration-300 hover:bg-[#fcfbf9] sm:flex-row sm:items-center"
                        >
                          <div className="h-24 w-full overflow-hidden rounded-[20px] bg-[#f7f2eb] sm:w-24">
                            {item?.product?.images &&
                            item.product.images.length > 0 ? (
                              <img
                                src={item.product.images[0].url}
                                alt={item?.product?.name || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-stone-400">
                                No Image
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <p className="mb-2 text-[11px] uppercase tracking-[0.22em] text-stone-500">
                              Premium Edit
                            </p>

                            <h2 className="text-lg font-medium text-stone-900">
                              {item?.product?.name || "Product"}
                            </h2>

                            {item?.selectedVariant?.name &&
                              item?.selectedVariant?.value && (
                                <p className="mt-1 text-sm text-stone-500">
                                  Variant: {item.selectedVariant.name} -{" "}
                                  {item.selectedVariant.value}
                                </p>
                              )}

                            <p className="mt-1 text-sm text-stone-500">
                              Quantity: {item?.quantity || 0}
                            </p>

                            <p className="mt-2 text-sm font-medium text-stone-700">
                              Price: ₹{item?.price || 0}
                            </p>
                          </div>

                          {order?.status === "Delivered" && (
                            <button
                              onClick={() => openExchangeModal(order, item)}
                              className="rounded-full border border-black px-5 py-2.5 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                            >
                              Request Exchange
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 rounded-[24px] border border-stone-200 bg-[#f8f2ea] p-5">
                      <h3 className="mb-3 text-lg font-semibold text-stone-900">
                        Shipping Details
                      </h3>

                      <div className="grid gap-3 md:grid-cols-2">
                        <p className="text-sm text-stone-700">
                          <span className="font-medium text-stone-900">
                            Courier:
                          </span>{" "}
                          {order?.shippingDetails?.courierName || "-"}
                        </p>

                        <p className="text-sm text-stone-700">
                          <span className="font-medium text-stone-900">
                            Tracking Number:
                          </span>{" "}
                          {order?.shippingDetails?.trackingNumber || "-"}
                        </p>

                        <p className="text-sm text-stone-700">
                          <span className="font-medium text-stone-900">
                            Shipped At:
                          </span>{" "}
                          {order?.shippingDetails?.shippedAt
                            ? new Date(
                                order.shippingDetails.shippedAt
                              ).toLocaleString()
                            : "-"}
                        </p>

                        <p className="text-sm text-stone-700">
                          <span className="font-medium text-stone-900">
                            Estimated Delivery:
                          </span>{" "}
                          {order?.shippingDetails?.estimatedDelivery
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
                            {order?.shippingDetails?.shippingNote || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {order?.trackingHistory &&
                      order.trackingHistory.length > 0 && (
                        <div className="mt-8">
                          <h3 className="mb-4 text-xl font-semibold text-stone-900">
                            Tracking History
                          </h3>

                          <div className="space-y-3">
                            {order.trackingHistory.map((track, index) => (
                              <div
                                key={index}
                                className="rounded-[20px] bg-[#fcfaf7] px-4 py-3 transition duration-300 hover:bg-[#f5efe6]"
                              >
                                <p className="font-medium text-stone-900">
                                  {track?.status}
                                </p>
                                <p className="mt-1 text-sm text-stone-500">
                                  {track?.date
                                    ? new Date(track.date).toLocaleString()
                                    : ""}
                                </p>
                                {track?.note ? (
                                  <p className="mt-1 text-sm text-stone-600">
                                    Note: {track.note}
                                  </p>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {order?.shippingAddress && (
                      <div className="mt-8 rounded-[24px] border border-stone-200 bg-[#fcfaf7] p-5">
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
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state}
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
      </div>

      {showExchangeModal && selectedExchangeItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
                  Exchange Request
                </p>
                <h2 className="text-2xl font-semibold text-stone-900">
                  Request Product Exchange
                </h2>
              </div>

              <button
                onClick={closeExchangeModal}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm hover:bg-stone-100"
              >
                Close
              </button>
            </div>

            <div className="mb-6 rounded-[24px] border border-stone-200 bg-[#fcfaf7] p-4">
              <p className="font-medium text-stone-900">
                {selectedExchangeItem.item.product?.name}
              </p>

              {selectedExchangeItem.item.selectedVariant?.name &&
                selectedExchangeItem.item.selectedVariant?.value && (
                  <p className="mt-1 text-sm text-stone-600">
                    Variant: {selectedExchangeItem.item.selectedVariant.name} -{" "}
                    {selectedExchangeItem.item.selectedVariant.value}
                  </p>
                )}

              <p className="mt-1 text-sm text-stone-600">
                Ordered Quantity: {selectedExchangeItem.item.quantity}
              </p>
            </div>

            <form onSubmit={handleExchangeSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm text-stone-700">
                  Request Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedExchangeItem.item.quantity}
                  value={exchangeForm.requestQuantity}
                  onChange={(e) =>
                    setExchangeForm((prev) => ({
                      ...prev,
                      requestQuantity: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-stone-700">
                  Reason
                </label>
                <input
                  type="text"
                  value={exchangeForm.reason}
                  onChange={(e) =>
                    setExchangeForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Want to try another design"
                  className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-stone-700">
                  Customer Note
                </label>
                <textarea
                  rows="4"
                  value={exchangeForm.customerNote}
                  onChange={(e) =>
                    setExchangeForm((prev) => ({
                      ...prev,
                      customerNote: e.target.value,
                    }))
                  }
                  placeholder="Optional note..."
                  className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                />
              </div>

              <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Product designated return address par moklavanu rehse. Final
                credit inspection pachi approve thase.
              </div>

              <button
                type="submit"
                disabled={exchangeLoading}
                className="w-full rounded-full bg-black px-6 py-3 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {exchangeLoading ? "Submitting..." : "Submit Exchange Request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;