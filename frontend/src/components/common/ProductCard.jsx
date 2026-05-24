import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../store/slices/cartSlice";
import { selectIsAdmin } from "../../store/slices/authSlice";
import productService from "../../api/productService";
import { truncate, formatPrice } from "../../utils/formatters";

const ProductCard = ({ product: initialProduct }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = useSelector(selectIsAdmin);

  const [stock, setStock] = useState(initialProduct.quantity ?? 0);
  const [adding, setAdding] = useState(false);

  const outOfStock = stock <= 0;

  const handleAddToCart = async () => {
    if (outOfStock || adding) return;
    setAdding(true);

    // 1. Update UI immediately (optimistic)
    setStock((s) => s - 1);
    dispatch(addToCart(initialProduct));
    toast.success(`${initialProduct.name} added to cart`);

    // 2. Persist to backend
    try {
      await productService.adjustStock(initialProduct._id, -1);
    } catch (err) {
      // Rollback UI if backend fails
      setStock((s) => s + 1);
      dispatch({ type: "cart/removeFromCart", payload: initialProduct._id });
      toast.error(err.message || "Could not add to cart — please try again");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="product-card"
      style={{
        background: "var(--card-bg, #fff)",
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {/* Image */}
      <div
        style={{
          background: "var(--cream)",
          height: "240px",
          overflow: "hidden",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <img
          src={productService.getPhotoUrl(initialProduct._id)}
          alt={initialProduct.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "20px",
            transition: "transform 0.4s ease",
          }}
        />
        {outOfStock && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "var(--danger)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 20,
              letterSpacing: ".04em",
            }}
          >
            OUT OF STOCK
          </div>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          padding: "18px",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          gap: "10px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--ink)",
            lineHeight: "1.5",
            minHeight: "48px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {initialProduct.name}
        </h3>

        <p
          style={{
            fontSize: "14px",
            color: "var(--ink-soft)",
            lineHeight: "1.6",
            flex: 1,
            minHeight: "65px",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {truncate(initialProduct.description, 90)}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "var(--accent)",
            }}
          >
            {formatPrice(initialProduct.price)}
          </span>
          {/* Live stock badge */}
          <span
            style={{
              fontSize: 11,
              color: outOfStock ? "var(--danger)" : "var(--success)",
              fontWeight: 600,
            }}
          >
            {outOfStock ? "Out of stock" : `${stock} left`}
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => navigate(`/product/${initialProduct.slug}`)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid var(--accent)",
              background: "transparent",
              color: "var(--accent)",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Details
          </button>

          {!isAdmin && (
            <button
              onClick={handleAddToCart}
              disabled={outOfStock || adding}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "12px",
                border: "none",
                background: outOfStock ? "var(--stone)" : "var(--accent)",
                color: outOfStock ? "var(--ink-soft)" : "#fff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: outOfStock ? "not-allowed" : "pointer",
                transition: "all 0.3s ease",
                opacity: adding ? 0.7 : 1,
              }}
            >
              {adding ? "Adding…" : outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
