import { useEffect, useState } from "react";
import { getMyExchangeRequestsApi, getUserProfileApi } from "../services/api";
import toast from "react-hot-toast";
import PageHeaderSkeleton from "../components/PageHeaderSkeleton";
import Skeleton from "../components/Skeleton";

function MyExchanges() {
  const [exchangeRequests, setExchangeRequests] = useState([]);
  const [walletGrams, setWalletGrams] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchExchangeRequests = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const [exchangeData, profileData] = await Promise.all([
        getMyExchangeRequestsApi(token),
        getUserProfileApi(token),
      ]);

      setExchangeRequests(Array.isArray(exchangeData) ? exchangeData : []);
      setWalletGrams(Number(profileData?.silverWalletGrams || 0));
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

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "approved":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "product_received":
        return "bg-purple-100 text-purple-700";
      case "credit_issued":
        return "bg-green-100 text-green-700";
      default:
        return "bg-stone-100 text-stone-700";
    }
  };

  if (loading) {
    return (
      <div className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <PageHeaderSkeleton />
          <div className="mb-8">
            <Skeleton className="h-28 w-full rounded-[30px]" />
          </div>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-[30px] border border-stone-200 bg-white p-6"
              >
                <div className="mb-4 grid gap-4 md:grid-cols-4">
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                  <Skeleton className="h-14 w-full rounded-2xl" />
                </div>
                <Skeleton className="h-24 w-full rounded-2xl" />
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
    <div className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-stone-500">
            My Exchange Requests
          </p>
          <h1 className="text-4xl font-semibold text-stone-900">
            Exchange History
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-600">
            View all submitted exchange requests and their approval status.
          </p>
        </div>

        <div className="mb-8 rounded-[30px] border border-stone-200 bg-[#faf7f2] p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-stone-500">
            Silver Wallet
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-stone-900">
            {walletGrams.toFixed(3)} g
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Admin jyare exchange request ne credit issue karse tyare aa wallet ma grams add thase.
          </p>
        </div>

        {exchangeRequests.length === 0 ? (
          <div className="rounded-[32px] border border-stone-200 bg-[#faf7f2] py-16 text-center text-stone-600">
            No exchange requests found.
          </div>
        ) : (
          <div className="space-y-6">
            {exchangeRequests.map((request) => (
              <div
                key={request._id}
                className="rounded-[30px] border border-stone-200 bg-white p-6 transition duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
              >
                <div className="mb-5 grid gap-4 md:grid-cols-4">
                  <div className="rounded-[20px] bg-[#faf7f2] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Product
                    </p>
                    <p className="mt-2 font-medium text-stone-900">
                      {request.productName}
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-[#faf7f2] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Estimated Credit
                    </p>
                    <p className="mt-2 font-semibold text-stone-900">
                      {request.estimatedCreditGrams} g
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-[#faf7f2] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Approved Credit
                    </p>
                    <p className="mt-2 font-semibold text-stone-900">
                      {request.approvedCreditGrams || 0} g
                    </p>
                  </div>

                  <div className="rounded-[20px] bg-[#faf7f2] p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                      Status
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-stone-200 bg-white p-4">
                  {request.selectedVariant?.name && request.selectedVariant?.value && (
                    <p className="mb-2 text-sm text-stone-600">
                      Variant: {request.selectedVariant.name} - {request.selectedVariant.value}
                    </p>
                  )}

                  <p className="text-sm text-stone-600">
                    Quantity: {request.requestQuantity}
                  </p>

                  <p className="mt-2 text-sm text-stone-600">
                    Reason: {request.reason || "-"}
                  </p>

                  {request.customerNote && (
                    <p className="mt-2 text-sm text-stone-600">
                      Your Note: {request.customerNote}
                    </p>
                  )}

                  {request.adminNote && (
                    <p className="mt-2 text-sm font-medium text-stone-800">
                      Admin Note: {request.adminNote}
                    </p>
                  )}

                  <p className="mt-2 text-sm text-stone-600">
                    Wallet Credited: {request.creditedToWallet ? "Yes" : "No"}
                  </p>

                  <p className="mt-3 text-xs text-stone-500">
                    Requested on: {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyExchanges;