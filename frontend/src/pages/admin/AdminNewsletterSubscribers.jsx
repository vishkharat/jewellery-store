import { useEffect, useState } from "react";
import { getAdminNewsletterSubscribersApi } from "../../services/api";
import toast from "react-hot-toast";

function AdminNewsletterSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      const data = await getAdminNewsletterSubscribersApi(token);
      setSubscribers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching newsletter subscribers:", error);
      toast.error(
        error.response?.data?.message || "Failed to load newsletter subscribers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  if (loading) {
    return <div className="text-lg text-stone-600">Loading subscribers...</div>;
  }

  return (
    <div>
      <section className="mb-8 rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
          Admin Newsletter
        </p>
        <h1 className="text-4xl font-semibold text-stone-900">
          Newsletter Subscribers
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          View all users who subscribed through the footer newsletter form.
          Latest subscribers appear first.
        </p>
      </section>

      {subscribers.length === 0 ? (
        <div className="rounded-[30px] border border-stone-200 bg-[#faf7f2] py-16 text-center text-stone-600">
          No newsletter subscribers found.
        </div>
      ) : (
        <div className="space-y-4">
          {subscribers.map((subscriber) => (
            <div
              key={subscriber._id}
              className="rounded-[28px] border border-stone-200 bg-white p-5 transition duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Email
                  </p>
                  <p className="mt-2 break-all font-medium text-stone-900">
                    {subscriber.email}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Status
                  </p>
                  <p className="mt-2 font-medium capitalize text-stone-900">
                    {subscriber.status || "active"}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Subscribed On
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {subscriber.createdAt
                      ? new Date(subscriber.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminNewsletterSubscribers;