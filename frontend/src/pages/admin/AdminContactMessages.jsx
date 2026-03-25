import { useEffect, useState } from "react";
import { getAdminContactMessagesApi } from "../../services/api";
import toast from "react-hot-toast";

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      const data = await getAdminContactMessagesApi(token);
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error fetching contact messages:", error);
      toast.error(
        error.response?.data?.message || "Failed to load contact messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return <div className="text-lg text-stone-600">Loading contact messages...</div>;
  }

  return (
    <div>
      <section className="mb-8 rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
          Admin Inquiries
        </p>
        <h1 className="text-4xl font-semibold text-stone-900">
          Contact Messages
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          Review all customer inquiries submitted through the contact form.
          Messages are ordered with the newest first.
        </p>
      </section>

      {messages.length === 0 ? (
        <div className="rounded-[30px] border border-stone-200 bg-[#faf7f2] py-16 text-center text-stone-600">
          No contact messages found.
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((item) => (
            <div
              key={item._id}
              className="rounded-[30px] border border-stone-200 bg-white p-6 transition duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)]"
            >
              <div className="mb-5 grid gap-4 border-b border-stone-200 pb-5 md:grid-cols-4">
                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Name
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {item.name}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Email
                  </p>
                  <p className="mt-2 break-all font-medium text-stone-900">
                    {item.email}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Phone
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {item.phone || "N/A"}
                  </p>
                </div>

                <div className="rounded-[20px] bg-[#faf7f2] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Received
                  </p>
                  <p className="mt-2 font-medium text-stone-900">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="mb-4 rounded-[22px] border border-stone-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  Subject
                </p>
                <p className="mt-2 text-lg font-semibold text-stone-900">
                  {item.subject}
                </p>
              </div>

              <div className="rounded-[22px] border border-stone-200 bg-[#fcfaf7] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                  Message
                </p>
                <p className="mt-3 whitespace-pre-line text-sm leading-8 text-stone-700">
                  {item.message}
                </p>
              </div>

              <div className="mt-4">
                <span className="inline-flex rounded-full bg-stone-100 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-stone-700">
                  {item.status || "new"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminContactMessages;