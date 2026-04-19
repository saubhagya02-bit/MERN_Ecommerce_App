import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import categoryService from "../../api/categoryService";
import productService from "../../api/productService";

const { Option } = Select;

const initialForm = {
  name: "",
  description: "",
  price: "",
  quantity: "",
  category: "",
  shipping: "",
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [photo, setPhoto] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoryService.getAll().then(({ data }) => {
      if (data?.success) setCategories(data.category);
    });
  }, []);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append("photo", photo);

      const { data } = await productService.create(fd);
      if (data?.success) {
        toast.success("Product created!");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to create product");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Product">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Create Product
              </h2>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 max-w-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <Select
                    placeholder="Select category"
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
                    Product Photo
                  </label>
                  <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                    <span className="text-sm text-gray-500">
                      {photo ? photo.name : "Click to upload photo (max 1MB)"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => setPhoto(e.target.files[0])}
                    />
                  </label>
                  {photo && (
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="preview"
                      className="mt-3 h-40 object-contain rounded-lg border border-gray-100"
                    />
                  )}
                </div>

                {[
                  {
                    name: "name",
                    label: "Product Name",
                    type: "text",
                    placeholder: "e.g. Nike Air Max",
                  },
                  {
                    name: "description",
                    label: "Description",
                    type: "text",
                    placeholder: "Product description",
                  },
                  {
                    name: "price",
                    label: "Price ($)",
                    type: "number",
                    placeholder: "e.g. 49.99",
                  },
                  {
                    name: "quantity",
                    label: "Quantity",
                    type: "number",
                    placeholder: "e.g. 100",
                  },
                ].map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="input-field"
                      required
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Shipping Available
                  </label>
                  <Select
                    placeholder="Select shipping"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary py-3 mt-2"
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
