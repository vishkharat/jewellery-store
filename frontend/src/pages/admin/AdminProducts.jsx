import { useEffect, useState } from "react";
import { getAllProducts, deleteProductApi } from "../../services/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data.products || []);
    } catch (error) {
      console.log("Error fetching admin products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
      );

      if (!confirmDelete) return;

      await deleteProductApi(productId, token);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) {
    return <div className="text-lg text-stone-600">Loading products...</div>;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
            Admin Products
          </p>
          <h1 className="text-4xl font-semibold text-stone-900">
            Manage Products
          </h1>
        </div>

        <Link
          to="/admin/products/add"
          className="rounded-full bg-black px-6 py-3 text-sm text-white transition hover:bg-stone-800"
        >
          Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[30px] border border-stone-200 bg-[#faf7f2] py-16 text-center text-stone-600">
          No products found.
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="flex flex-col gap-4 rounded-[30px] border border-stone-200 bg-white p-4 transition duration-300 hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center"
            >
              <div className="h-24 w-full overflow-hidden rounded-[22px] bg-[#f7f2eb] sm:w-24">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
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
                  Product
                </p>

                <h2 className="text-xl font-medium text-stone-900">
                  {product.name}
                </h2>

                <p className="mt-1 text-sm capitalize text-stone-500">
                  {product.type} • {product.metal}
                </p>

                <p
                  className={`mt-2 text-sm font-medium ${
                    product.stock === 0
                      ? "text-red-500"
                      : product.stock < 5
                      ? "text-orange-500"
                      : "text-green-600"
                  }`}
                >
                  Stock: {product.stock}
                </p>

                <p className="mt-2 text-lg font-semibold text-stone-900">
                  ₹{product.price}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/admin/products/edit/${product._id}`}
                  className="rounded-full border border-stone-300 px-5 py-2 text-sm transition hover:bg-stone-100"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(product._id)}
                  className="rounded-full bg-red-500 px-5 py-2 text-sm text-white transition hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProducts;