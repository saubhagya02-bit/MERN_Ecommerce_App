import axiosInstance from "./axiosInstance";

const productService = {
  getAll: () => axiosInstance.get("/product/get-product"),
  getOne: (slug) => axiosInstance.get(`/product/get-product/${slug}`),
  getList: (page) => axiosInstance.get(`/product/product-list/${page}`),
  getCount: () => axiosInstance.get("/product/product-count"),

  getPhotoUrl: (id) =>
    `${import.meta.env.VITE_API_URL || ""}/api/v1/product/product-photo/${id}`,
  getByCategory: (slug) =>
    axiosInstance.get(`/product/product-category/${slug}`),
  getRelated: (pid, cid) =>
    axiosInstance.get(`/product/related-product/${pid}/${cid}`),
  search: (keyword) => axiosInstance.get(`/product/search/${keyword}`),
  filter: (checked, radio, page = 1, perPage = 6) =>
    axiosInstance.post("/product/product-filters", {
      checked,
      radio,
      page,
      perPage,
    }),
  create: (formData) => axiosInstance.post("/product/create-product", formData),
  update: (pid, formData) =>
    axiosInstance.put(`/product/update-product/${pid}`, formData),
  delete: (pid) => axiosInstance.delete(`/product/product/${pid}`),

  // Stock adjustment
  adjustStock: (productId, delta) =>
    axiosInstance.patch(`/product/stock/${productId}`, { delta }),
};

export default productService;
