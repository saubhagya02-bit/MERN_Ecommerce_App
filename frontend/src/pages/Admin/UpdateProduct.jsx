import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Select } from "antd";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import categoryService from "../../api/categoryService";
import productService from "../../api/productService";

const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    shipping: "",
  });
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, catRes] = await Promise.all([
          productService.getOne(slug),
          categoryService.getAll(),
        ]);

        const p = productRes.data?.product;
        if (!p) {
          toast.error("Product not found");
          navigate("/dashboard/admin/products");
          return;
        }

        setId(p._id);
        setForm({
          name: p.name,
          description: p.description,
          price: p.price,
          quantity: p.quantity,
          category: p.category?._id || "",
          shipping: p.shipping ? "1" : "0",
        });

        if (catRes.data?.success) setCategories(catRes.data.category);
      } catch {
        toast.error("Failed to load product");
      }
    };
    fetchData();
  }, [slug, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append("photo", photo);

      const { data } = await productService.update(id, fd);
      if (data?.success) {
        toast.success("Product updated!");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Update failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await productService.delete(id);
      toast.success("Product deleted");
      navigate("/dashboard/admin/products");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <Layout title="Update Product">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Update Product
              </h2>

              <form
                onSubmit={handleUpdate}
                className="flex flex-col gap-4 max-w-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select
                    value={form.category || undefined}
                    size="large"
                    className="w-full"
                    onChange={(val) =>
                      setForm((p) => ({ ...p, category: val }))
                    }
                  >
                    {categories.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo
                  </label>
                  <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                    <span className="text-sm text-gray-500">
                      {photo ? photo.name : "Click to change photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </label>
                  <img
                    src={
                      photo
                        ? URL.createObjectURL(photo)
                        : productService.getPhotoUrl(id)
                    }
                    alt="product"
                    className="mt-3 h-40 object-contain rounded-lg border border-gray-100"
                  />
                </div>

                {[
                  { name: "name", label: "Product Name", type: "text" },
                  { name: "description", label: "Description", type: "text" },
                  { name: "price", label: "Price ($)", type: "number" },
                  { name: "quantity", label: "Quantity", type: "number" },
                ].map(({ name, label, type }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping
                  </label>
                  <Select
                    value={form.shipping || undefined}
                    size="large"
                    className="w-full"
                    onChange={(val) =>
                      setForm((p) => ({ ...p, shipping: val }))
                    }
                  >
                    <Option value="1">Yes</Option>
                    <Option value="0">No</Option>
                  </Select>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary py-3 flex-1"
                  >
                    {loading ? "Saving..." : "Update Product"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="btn-danger py-3 flex-1"
                  >
                    Delete Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
