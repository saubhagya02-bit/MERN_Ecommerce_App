import { useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import CategoryForm from "../../components/Form/CategoryForm";
import categoryService from "../../api/categoryService";
import toast from "react-hot-toast";
import { Modal } from "antd";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const getAllCategory = async () => {
    try {
      const { data } = await categoryService.getAll();
      if (data?.success) setCategories(data.category);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await categoryService.create(name);
      if (data?.success) {
        toast.success(`${name} created!`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
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
        toast.success(`${updatedName} updated!`);
        setVisible(false);
        setSelected(null);
        setUpdatedName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await categoryService.delete(id);
      if (data?.success) {
        toast.success("Category deleted!");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Manage Categories — Admin">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
                Manage Categories
              </h1>
              <div className="max-w-md mb-8">
                <CategoryForm
                  handleSubmit={handleCreate}
                  value={name}
                  setValue={setName}
                  submitLabel="Create Category"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <th className="text-left pb-3 font-semibold text-gray-500 dark:text-gray-400">
                        #
                      </th>
                      <th className="text-left pb-3 font-semibold text-gray-500 dark:text-gray-400">
                        Name
                      </th>
                      <th className="text-left pb-3 font-semibold text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c, i) => (
                      <tr
                        key={c._id}
                        className="border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                      >
                        <td className="py-3 text-gray-400 dark:text-gray-500">
                          {i + 1}
                        </td>
                        <td className="py-3 font-medium text-gray-800 dark:text-gray-200">
                          {c.name}
                        </td>
                        <td className="py-3 flex gap-2">
                          <button
                            onClick={() => {
                              setVisible(true);
                              setSelected(c);
                              setUpdatedName(c.name);
                            }}
                            className="btn-primary text-xs px-3 py-1"
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
                {categories.length === 0 && (
                  <p className="text-center text-gray-400 dark:text-gray-500 py-8">
                    No categories yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        title="Edit Category"
      >
        <CategoryForm
          handleSubmit={handleUpdate}
          value={updatedName}
          setValue={setUpdatedName}
          submitLabel="Update Category"
        />
      </Modal>
    </Layout>
  );
};

export default CreateCategory;
