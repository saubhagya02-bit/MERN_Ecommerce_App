import axiosInstance from "./axiosInstance";

const reviewService = {
  getReviews: (productId) => axiosInstance.get(`/review/${productId}`),
  createReview: (productId, payload) =>
    axiosInstance.post(`/review/${productId}`, payload),
  deleteReview: (reviewId) => axiosInstance.delete(`/review/${reviewId}`),
};

export default reviewService;
