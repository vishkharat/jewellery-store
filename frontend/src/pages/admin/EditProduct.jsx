import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getProductById,
  updateProductApi,
  addProductImagesApi,
  deleteProductImageApi,
} from "../../services/api";
import toast from "react-hot-toast";

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

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
  const [productImages, setProductImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(id);

      setFormData({
        name: data.name || "",
        description: data.description || "",
        category: data.category || "demi-fine jewellery",
        type: data.type || "ring",
        metal: data.metal || "silver",
        weight: data.weight || "",
        metalWeight: data.metalWeight || "",
        purity: data.purity || "0.925",
        makingCharges: data.makingCharges || "",
        price: data.price || "",
        stock: data.stock || "",
        isFeatured: data.isFeatured || false,
      });

      setVariants(
        Array.isArray(data.variants)
          ? data.variants.map((variant) => ({
              name: variant.name || "",
              value: variant.value || "",
              stock: variant.stock ?? "",
            }))
          : []
      );

      setProductImages(data.images || []);
    } catch (error) {
      console.log("Error fetching product", error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
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

      setSaving(true);

      const updatedPayload = {
        ...formData,
        variants: JSON.stringify(getCleanVariants()),
      };

      await updateProductApi(id, updatedPayload, token);

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  const handleAddImages = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      if (newImages.length === 0) {
        toast.error("Please select images first");
        return;
      }

      setUploadingImages(true);

      const submitData = new FormData();

      newImages.forEach((image) => {
        submitData.append("images", image);
      });

      const updatedProduct = await addProductImagesApi(id, submitData, token);

      setProductImages(updatedProduct.images || []);
      setNewImages([]);
      setNewImagePreviews([]);

      toast.success("Images added successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add images");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this image?"
      );

      if (!confirmDelete) return;

      const response = await deleteProductImageApi(id, imageId, token);

      setProductImages(response.images || []);
      toast.success("Image deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete image");
    }
  };

  if (loading) {
    return <div className="text-lg text-stone-600">Loading product...</div>;
  }

  return (
    <div>
      <section className="mb-8 rounded-[34px] border border-stone-200 bg-white p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] sm:p-8">
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-stone-500">
          Admin Products
        </p>
        <h1 className="text-4xl font-semibold text-stone-900">Edit Product</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-600">
          Update details, manage product images, edit variants, and control stock.
        </p>
      </section>

      <div className="mb-10 rounded-3xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-2xl font-semibold text-stone-900">
          Current Images
        </h2>

        {productImages.length === 0 ? (
          <p className="text-stone-500">No images found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {productImages.map((image) => (
              <div
                key={image._id}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
              >
                <img
                  src={image.url}
                  alt="product"
                  className="h-32 w-full object-cover"
                />

                <div className="p-3">
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image._id)}
                    className="w-full rounded-full bg-red-500 px-4 py-2 text-sm text-white transition hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-10 rounded-3xl border border-stone-200 bg-[#faf7f2] p-6">
        <h2 className="mb-4 text-2xl font-semibold text-stone-900">
          Add More Images
        </h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleNewImageChange}
          className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3"
        />

        {newImagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {newImagePreviews.map((preview, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-stone-200 bg-white"
              >
                <img
                  src={preview}
                  alt={`preview-${index}`}
                  className="h-32 w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={handleAddImages}
          disabled={uploadingImages}
          className="mt-5 rounded-full bg-black px-6 py-3 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {uploadingImages ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] border border-stone-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-2xl font-semibold text-stone-900">
            Product Details
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

        <div className="lg:col-span-2 flex items-center gap-3">
          <input
            type="checkbox"
            name="isFeatured"
            checked={formData.isFeatured}
            onChange={handleChange}
            className="h-4 w-4"
          />
          <label className="text-sm text-stone-700">
            Mark as Featured Product
          </label>
        </div>

        <div className="lg:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-black px-8 py-3 text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {saving ? "Updating Product..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;