import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Modal } from "antd";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import CategoryForm from "../../components/Form/CategoryForm";
import categoryService from "../../api/categoryService";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAll();
      if (data?.success) setCategories(data.category);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await categoryService.create(name);
      if (data?.success) {
        toast.success(`"${name}" created!`);
        setName("");
        fetchCategories();
      } else {
        toast.error(data?.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await categoryService.update(selected._id, updatedName);
      if (data?.success) {
        toast.success(`"${updatedName}" updated!`);
        setModalVisible(false);
        setSelected(null);
        setUpdatedName("");
        fetchCategories();
      } else {
        toast.error(data?.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      const { data } = await categoryService.delete(id);
      if (data?.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data?.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Manage Categories">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          <div className="md:col-span-3 flex flex-col gap-6">
            {/* Create form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Add Category
              </h2>
              <CategoryForm
                handleSubmit={handleCreate}
                value={name}
                setValue={setName}
                submitLabel="Create"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                All Categories ({categories.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 font-semibold text-gray-600">
                        Name
                      </th>
                      <th className="text-left py-3 px-2 font-semibold text-gray-600">
                        Slug
                      </th>
                      <th className="text-right py-3 px-2 font-semibold text-gray-600">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr
                        key={c._id}
                        className="border-b border-gray-50 hover:bg-gray-50"
                      >
                        <td className="py-3 px-2 text-gray-800 font-medium">
                          {c.name}
                        </td>
                        <td className="py-3 px-2 text-gray-500">{c.slug}</td>
                        <td className="py-3 px-2 text-right flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelected(c);
                              setUpdatedName(c.name);
                              setModalVisible(true);
                            }}
                            className="btn-outline text-xs px-3 py-1"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="btn-danger text-xs px-3 py-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        title="Edit Category"
      >
        <div className="pt-4">
          <CategoryForm
            handleSubmit={handleUpdate}
            value={updatedName}
            setValue={setUpdatedName}
            submitLabel="Update"
          />
        </div>
      </Modal>
    </Layout>
  );
};

export default CreateCategory;
