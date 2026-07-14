import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import StarRating from "../../components/common/StarRating";
import productService from "../../api/productService";
import reviewService from "../../api/reviewService";
import { addToCart } from "../../store/slices/cartSlice";
import { selectIsAdmin, selectCurrentUser } from "../../store/slices/authSlice";
import { formatPrice, formatDate } from "../../utils/formatters";
import { HiTrash, HiShoppingCart, HiCheck } from "react-icons/hi";

// Review form
const ReviewForm = ({ productId, onSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Please select a star rating");
      return;
    }
    setLoading(true);
    try {
      await reviewService.createReview(productId, { rating, comment });
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      onSubmitted();
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <div>
        <p className="form-label" style={{ marginBottom: 6 }}>
          Your Rating
        </p>
        <StarRating value={rating} onChange={setRating} size={28} />
      </div>
      <div>
        <label className="form-label">Comment (optional)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Share your experience with this product…"
          maxLength={500}
          className="input-field"
          style={{ resize: "none" }}
        />
        <p
          style={{
            fontSize: 11,
            color: "var(--ink-faint)",
            textAlign: "right",
            marginTop: 2,
          }}
        >
          {comment.length}/500
        </p>
      </div>
      <button
        type="submit"
        disabled={loading || !rating}
        className="btn-primary"
        style={{ alignSelf: "flex-start", padding: "9px 24px" }}
      >
        {loading ? "Submitting…" : "Submit Review"}
      </button>
    </form>
  );
};

const ReviewCard = ({ review, currentUserId, onDelete }) => {
  const isOwner = review.user?._id === currentUserId;
  return (
    <div style={{ padding: "14px 0", borderBottom: "1px solid var(--stone)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Avatar */}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: "var(--accent-lt)",
              color: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {review.user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
              {review.user?.name}
            </p>
            <p style={{ fontSize: 11, color: "var(--ink-faint)" }}>
              {formatDate(review.createdAt)}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <StarRating value={review.rating} size={14} />
          {isOwner && (
            <button
              onClick={() => onDelete(review._id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--danger)",
                padding: 4,
                borderRadius: 6,
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#FEF2F2")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              title="Delete your review"
            >
              <HiTrash style={{ fontSize: 14 }} />
            </button>
          )}
        </div>
      </div>
      {review.comment && (
        <p
          style={{
            fontSize: 13,
            color: "var(--ink-mid)",
            lineHeight: 1.6,
            paddingLeft: 44,
          }}
        >
          {review.comment}
        </p>
      )}
    </div>
  );
};

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);
  const currentUser = useSelector(selectCurrentUser);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getOne(slug);
      setProduct(data?.product);
      if (data?.product?._id) {
        const [relRes, revRes] = await Promise.all([
          data.product.category?._id
            ? productService.getRelated(
                data.product._id,
                data.product.category._id,
              )
            : Promise.resolve({ data: { products: [] } }),
          reviewService.getReviews(data.product._id),
        ]);
        setRelated(relRes.data?.products || []);
        setReviews(revRes.data?.reviews || []);
      }
    } catch {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewService.deleteReview(reviewId);
      toast.success("Review deleted");
      fetchProduct();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  if (loading)
    return (
      <Layout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <div className="spinner" />
        </div>
      </Layout>
    );

  if (!product)
    return (
      <Layout>
        <p
          style={{
            textAlign: "center",
            padding: "4rem 0",
            color: "var(--ink-soft)",
          }}
        >
          Product not found.
        </p>
      </Layout>
    );

  const outOfStock = product.quantity <= 0;
  const hasReviewed = reviews.some((r) => r.user?._id === currentUser?._id);
  const avgRating = product.averageRating || 0;
  const reviewCount = product.reviewCount || reviews.length;

  return (
    <Layout title={`${product.name} — EliteMart`}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Product card */}
        <div
          className="panel"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2.5rem",
            padding: "2rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Image */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                background: "var(--cream)",
                borderRadius: 14,
                padding: "2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
              }}
            >
              <img
                src={product.photo?.url}
                alt={product.name}
                style={{
                  maxHeight: 300,
                  maxWidth: "100%",
                  objectFit: "contain",
                  transition: "transform .3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.04)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>
          </div>

          {/* Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.9rem",
              justifyContent: "center",
            }}
          >
            {/* Category */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "var(--accent-lt)",
                color: "var(--accent)",
                fontSize: 11,
                fontWeight: 600,
                padding: "3px 12px",
                borderRadius: 20,
                width: "fit-content",
                letterSpacing: ".02em",
              }}
            >
              {product.category?.name}
            </span>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "var(--ink)",
                letterSpacing: "-.02em",
                lineHeight: 1.25,
              }}
            >
              {product.name}
            </h1>

            {/* Rating summary */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StarRating value={avgRating} size={18} />
              <span style={{ fontSize: 13, color: "var(--ink-soft)" }}>
                {avgRating > 0 ? avgRating.toFixed(1) : ""} ({reviewCount}{" "}
                review{reviewCount !== 1 ? "s" : ""})
              </span>
            </div>

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.85rem",
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              {formatPrice(product.price)}
            </p>

            <p
              style={{
                color: "var(--ink-mid)",
                lineHeight: 1.75,
                fontSize: 14,
              }}
            >
              {product.description}
            </p>

            {/* Stock + shipping */}
            <div style={{ display: "flex", gap: 16, fontSize: 13 }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  color: outOfStock ? "var(--danger)" : "var(--success)",
                  fontWeight: 500,
                }}
              >
                {outOfStock ? (
                  "✕ Out of stock"
                ) : (
                  <>
                    <HiCheck style={{ fontSize: 14 }} /> In stock (
                    {product.quantity})
                  </>
                )}
              </span>
              {product.shipping && (
                <span style={{ color: "var(--ink-soft)" }}>
                  🚚 Free shipping
                </span>
              )}
            </div>

            {/* Add to Cart */}
            {!isAdmin && (
              <button
                onClick={() => {
                  dispatch(addToCart(product));
                  toast.success("Added to cart!");
                }}
                disabled={outOfStock}
                className="btn-primary"
                style={{
                  padding: "13px 0",
                  fontSize: 15,
                  marginTop: "0.5rem",
                  gap: 8,
                  opacity: outOfStock ? 0.4 : 1,
                  cursor: outOfStock ? "not-allowed" : "pointer",
                }}
              >
                <HiShoppingCart style={{ fontSize: 18 }} />
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div className="panel" style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.2rem",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              Customer Reviews
            </h2>

            {/* Rating breakdown */}
            {reviewCount > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "var(--cream)",
                  borderRadius: 10,
                  padding: "8px 14px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  {avgRating.toFixed(1)}
                </span>
                <div>
                  <StarRating value={avgRating} size={16} />
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--ink-soft)",
                      marginTop: 2,
                    }}
                  >
                    {reviewCount} review{reviewCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Write a review — logged-in non-admin users who haven't reviewed yet */}
          {currentUser && !isAdmin && !hasReviewed && (
            <div
              style={{
                background: "var(--cream)",
                borderRadius: 12,
                padding: "1.25rem",
                marginBottom: "1.5rem",
                border: "1px solid var(--stone)",
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 12,
                }}
              >
                Write a Review
              </p>
              <ReviewForm productId={product._id} onSubmitted={fetchProduct} />
            </div>
          )}

          {hasReviewed && (
            <div
              style={{
                background: "#F0FDF4",
                border: "1px solid #DCFCE7",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: 13,
                color: "var(--success)",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <HiCheck /> You've already reviewed this product.
            </div>
          )}

          {!currentUser && (
            <p
              style={{
                fontSize: 13,
                color: "var(--ink-soft)",
                marginBottom: "1rem",
              }}
            >
              <a
                href="/login"
                style={{ color: "var(--accent)", fontWeight: 500 }}
              >
                Sign in
              </a>{" "}
              to leave a review.
            </p>
          )}

          {/* Review list */}
          {reviews.length === 0 ? (
            <p
              style={{
                fontSize: 13,
                color: "var(--ink-faint)",
                textAlign: "center",
                padding: "2rem 0",
              }}
            >
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div>
              {reviews.map((r) => (
                <ReviewCard
                  key={r._id}
                  review={r}
                  currentUserId={currentUser?._id}
                  onDelete={handleDeleteReview}
                />
              ))}
            </div>
          )}
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: "1.25rem",
              }}
            >
              Similar Products
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
                gap: 16,
              }}
            >
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
