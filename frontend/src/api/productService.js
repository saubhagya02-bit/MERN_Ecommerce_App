import axiosInstance from "./axiosInstance";

const productService = {
  getAll: () => axiosInstance.get("/product/get-product"),
  getOne: (slug) => axiosInstance.get(`/product/get-product/${slug}`),
  getList: (page) => axiosInstance.get(`/product/product-list/${page}`),
  getCount: () => axiosInstance.get("/product/product-count"),
  getPhotoUrl: (id) => `/api/v1/product/product-photo/${id}`,
  getByCategory: (slug) =>
    axiosInstance.get(`/product/product-category/${slug}`),
  getRelated: (pid, cid) =>
    axiosInstance.get(`/product/related-product/${pid}/${cid}`),
  search: (keyword) => axiosInstance.get(`/product/search/${keyword}`),
  filter: (checked, radio) =>
    axiosInstance.post("/product/product-filters", { checked, radio }),
  create: (formData) => axiosInstance.post("/product/create-product", formData),
  update: (pid, formData) =>
    axiosInstance.put(`/product/update-product/${pid}`, formData),
  delete: (pid) => axiosInstance.delete(`/product/delete-product/${pid}`),
};

export default productService;
