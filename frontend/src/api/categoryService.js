import axiosInstance from "./axiosInstance";

const categoryService = {
  getAll: () => axiosInstance.get("/category/get-category"),
  getOne: (slug) => axiosInstance.get(`/category/single-category/${slug}`),
  create: (name) => axiosInstance.post("/category/create-category", { name }),
  update: (id, name) =>
    axiosInstance.put(`/category/update-category/${id}`, { name }),
  delete: (id) => axiosInstance.delete(`/category/delete-category/${id}`),
};

export default categoryService;
