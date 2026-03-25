import { useEffect, useMemo, useState } from "react";
import {
  getAllExchangeRequestsApi,
  updateExchangeRequestApi,
} from "../../services/api";
import toast from "react-hot-toast";

function AdminExchanges() {
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");

  const fetchExchangeRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const data = await getAllExchangeRequestsApi(token);

      const formattedData = Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            status: item.status || "pending",
            approvedCreditGrams:
              item.approvedCreditGrams !== undefined
                ? item.approvedCreditGrams
                : item.estimatedCreditGrams || 0,
            adminNote: item.adminNote || "",
          }))
        : [];

      setExchangeRequests(formattedData);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load exchange requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRequests();
  }, []);

  const summary = useMemo(() => {
    return {
      total: exchangeRequests.length,
      pending: exchangeRequests.filter(
        (item) => String(item.status).toLowerCase() === "pending"
      ).length,
      approved: exchangeRequests.filter(
        (item) => String(item.status).toLowerCase() === "approved"
      ).length,
      rejected: exchangeRequests.filter(
        (item) => String(item.status).toLowerCase() === "rejected"
      ).length,
    };
  }, [exchangeRequests]);

  const handleLocalChange = (id, field, value) => {
    setExchangeRequests((prev) =>
      prev.map((item) =>
        item._id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const handleSave = async (request) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      setSavingId(request._id);

      const payload = {
        status: request.status,
        approvedCreditGrams: Number(request.approvedCreditGrams || 0),
        adminNote: request.adminNote || "",
      };

      await updateExchangeRequestApi(request._id, payload, token);
      toast.success("Exchange request updated successfully");
      fetchExchangeRequests();
    } catch (error) {
      console.log(error);
      toast.error(
        error.response?.data?.message || "Failed to update exchange request"
      );
    } finally {
      setSavingId("");
    }
  };

  const getStatusBadgeClass = (status) => {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (normalized === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  if (loading) {
    return <div className="text-lg text-stone-600">Loading exchange requests...</div>;
  }

  return (
    <div>
      <section className="mb-8 rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
          Admin Exchanges
        </p>
        <h1 className="text-4xl font-semibold text-stone-900">
          Manage Exchange Requests
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          Review customer exchange requests, verify estimated credit, approve or
          reject submissions, and update wallet credit decisions from one clean
          admin workspace.
        </p>
      </section>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-[26px] border border-stone-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Total Requests
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">
            {summary.total}
          </p>
        </div>

        <div className="rounded-[26px] border border-stone-200 bg-[#f8f2ea] p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Pending
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">
            {summary.pending}
          </p>
        </div>

        <div className="rounded-[26px] border border-stone-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Approved
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">
            {summary.approved}
          </p>
        </div>

        <div className="rounded-[26px] border border-stone-200 bg-white p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Rejected
          </p>
          <p className="mt-3 text-3xl font-semibold text-stone-900">
            {summary.rejected}
          </p>
        </div>
      </div>

      {exchangeRequests.length === 0 ? (
        <div className="rounded-[30px] border border-stone-200 bg-[#faf7f2] py-16 text-center text-stone-600">
          No exchange requests found.
        </div>
      ) : (
        <div className="space-y-8">
          {exchangeRequests.map((request) => (
            <div
              key={request._id}
              className="rounded-[30px] border border-stone-200 bg-white p-6 transition duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-6 grid gap-4 border-b border-stone-200 pb-4 md:grid-cols-4">
                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Request ID
                  </p>
                  <p className="mt-2 break-all font-medium text-stone-900">
                    {request._id}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Customer
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {request.user?.name || "N/A"}
                  </p>
                  <p className="mt-1 text-sm text-stone-500">
                    {request.user?.email || ""}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Current Status
                  </p>
                  <div className="mt-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeClass(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </div>

                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Requested Qty
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-stone-900">
                    {request.requestQuantity || 1}
                  </p>
                </div>
              </div>

              <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[22px] border border-stone-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Product
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {request.product?.name || "N/A"}
                  </p>
                </div>

                <div className="rounded-[22px] border border-stone-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Original Metal Weight
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {Number(request.product?.metalWeight || 0).toFixed(3)} g
                  </p>
                </div>

                <div className="rounded-[22px] border border-stone-200 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Purity
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {request.product?.purity ?? 0.925}
                  </p>
                </div>

                <div className="rounded-[22px] border border-stone-200 bg-[#f8f2ea] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Estimated Credit
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {Number(request.estimatedCreditGrams || 0).toFixed(3)} g
                  </p>
                </div>
              </div>

              {request.selectedVariant?.name && request.selectedVariant?.value && (
                <div className="mb-6 rounded-[22px] border border-stone-200 bg-[#fcfaf7] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Selected Variant
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {request.selectedVariant.name} - {request.selectedVariant.value}
                  </p>
                </div>
              )}

              <div className="mb-6 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[22px] border border-stone-200 bg-[#fcfaf7] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Customer Reason
                  </p>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    {request.reason || "No reason provided"}
                  </p>
                </div>

                <div className="rounded-[22px] border border-stone-200 bg-[#fcfaf7] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Customer Note
                  </p>
                  <p className="mt-2 text-sm leading-7 text-stone-700">
                    {request.customerNote || "No note provided"}
                  </p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm text-stone-700">
                    Update Status
                  </label>
                  <select
                    value={request.status}
                    onChange={(e) =>
                      handleLocalChange(request._id, "status", e.target.value)
                    }
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                  >
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-stone-700">
                    Approved Credit (grams)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={request.approvedCreditGrams}
                    onChange={(e) =>
                      handleLocalChange(
                        request._id,
                        "approvedCreditGrams",
                        e.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-stone-700">
                    Admin Note
                  </label>
                  <input
                    type="text"
                    value={request.adminNote}
                    onChange={(e) =>
                      handleLocalChange(request._id, "adminNote", e.target.value)
                    }
                    placeholder="Optional note"
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleSave(request)}
                  disabled={savingId === request._id}
                  className="rounded-full bg-black px-6 py-3 text-sm text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
                >
                  {savingId === request._id ? "Saving..." : "Save Changes"}
                </button>

                <div className="rounded-full border border-stone-300 px-5 py-3 text-sm text-stone-600">
                  Wallet credit will be applied after approval
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminExchanges;