import { Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

function AdminLayout({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
        <AdminSidebar />
        <div className="rounded-3xl border border-stone-200 bg-white p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;