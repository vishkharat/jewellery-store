import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProductApi } from "../../services/api";
import toast from "react-hot-toast";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "demi-fine jewellery",
    type: "ring",
    metal: "silver",
    weight: "",
    metalWeight: "",
    purity: "0.925",
    makingCharges: "",
    price: "",
    stock: "",
    isFeatured: false,
  });

  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleAddVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: "",
        value: "",
        stock: "",
      },
    ]);
  };

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  };

  const handleRemoveVariantRow = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const getCleanVariants = () => {
    return variants
      .filter(
        (variant) =>
          variant.name.trim() &&
          variant.value.trim() &&
          variant.stock !== ""
      )
      .map((variant) => ({
        name: variant.name.trim(),
        value: variant.value.trim(),
        stock: Number(variant.stock),
      }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      setLoading(true);

      const submitData = new FormData();

      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("category", formData.category);
      submitData.append("type", formData.type);
      submitData.append("metal", formData.metal);
      submitData.append("weight", formData.weight);
      submitData.append("metalWeight", formData.metalWeight);
      submitData.append("purity", formData.purity);
      submitData.append("makingCharges", formData.makingCharges);
      submitData.append("price", formData.price);
      submitData.append("stock", formData.stock);
      submitData.append("isFeatured", formData.isFeatured);

      const cleanVariants = getCleanVariants();
      submitData.append("variants", JSON.stringify(cleanVariants));

      images.forEach((image) => {
        submitData.append("images", image);
      });

      await createProductApi(submitData, token);

      toast.success("Product created successfully");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="mb-8 rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
          Admin Products
        </p>
        <h1 className="text-4xl font-semibold text-stone-900">Add Product</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          Create a new jewellery product with stock, variants, featured status,
          and multiple images.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-stone-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-2xl font-semibold text-stone-900">
            Basic Details
          </h2>
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
          >
            <option value="demi-fine jewellery">Demi Fine Jewellery</option>
            <option value="9kt gold jewellery">9KT Gold Jewellery</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
          >
            <option value="ring">Ring</option>
            <option value="chain">Chain</option>
            <option value="bracelet">Bracelet</option>
            <option value="necklace">Necklace</option>
            <option value="earring">Earring</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">Metal</label>
          <select
            name="metal"
            value={formData.metal}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
          >
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="diamond">Diamond</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">
            Product Weight (Display) in grams
          </label>
          <input
            type="number"
            step="0.001"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">
            Metal Weight (Exchange) in grams
          </label>
          <input
            type="number"
            step="0.001"
            name="metalWeight"
            value={formData.metalWeight}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">Purity</label>
          <input
            type="number"
            step="0.001"
            name="purity"
            value={formData.purity}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
            required
          />
          <p className="mt-2 text-xs text-stone-500">925 silver mate 0.925 mukvu</p>
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">Making Charges</label>
          <input
            type="number"
            name="makingCharges"
            value={formData.makingCharges}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-stone-700">Total Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
            required
          />
        </div>

        <div className="lg:col-span-2">
          <label className="mb-2 block text-sm text-stone-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
            required
          />
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-stone-200 bg-[#faf7f2] p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-stone-900">Variants</h2>
              <p className="mt-1 text-sm text-stone-600">
                Example: Size / Length / Color / Width
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddVariantRow}
              className="rounded-full bg-black px-5 py-2 text-sm text-white transition hover:bg-stone-800"
            >
              Add Variant
            </button>
          </div>

          {variants.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-6 text-center text-sm text-stone-500">
              No variants added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid gap-4 rounded-2xl border border-stone-200 bg-white p-4 md:grid-cols-[1fr_1fr_140px_auto]"
                >
                  <input
                    type="text"
                    placeholder="Variant Name (e.g. Size)"
                    value={variant.name}
                    onChange={(e) =>
                      handleVariantChange(index, "name", e.target.value)
                    }
                    className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  />

                  <input
                    type="text"
                    placeholder="Variant Value (e.g. 18 inch)"
                    value={variant.value}
                    onChange={(e) =>
                      handleVariantChange(index, "value", e.target.value)
                    }
                    className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  />

                  <input
                    type="number"
                    placeholder="Stock"
                    value={variant.stock}
                    onChange={(e) =>
                      handleVariantChange(index, "stock", e.target.value)
                    }
                    className="rounded-2xl border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveVariantRow(index)}
                    className="rounded-full border border-red-300 px-5 py-3 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-stone-200 bg-white p-6">
          <label className="mb-2 block text-sm text-stone-700">
            Product Images
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-2xl border border-stone-300 px-4 py-3"
            required
          />

          <p className="mt-2 text-sm text-stone-500">
            You can select multiple images together. On Windows, use Ctrl + click.
          </p>

          {images.length > 0 && (
            <p className="mt-3 text-sm font-medium text-stone-800">
              {images.length} image(s) selected
            </p>
          )}

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border border-stone-200 bg-stone-100"
                >
                  <img
                    src={preview}
                    alt={`preview-${index}`}
                    className="h-28 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          <label className="text-sm text-stone-700">Mark as Featured Product</label>
        </div>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-black px-8 py-3 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;