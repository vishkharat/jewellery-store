import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/users/register", formData);

      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="mb-3 text-center text-sm uppercase tracking-[0.3em] text-stone-500">
          Create Account
        </p>

        <h1 className="mb-8 text-center text-3xl font-semibold text-stone-900">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-stone-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-stone-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-black px-6 py-3 text-white transition hover:bg-stone-800"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-stone-900 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;