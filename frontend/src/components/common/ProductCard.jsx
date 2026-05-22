import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../store/slices/cartSlice";
import {
  selectCurrentUser,
  selectIsAdmin,
} from "../../store/slices/authSlice";
import productService from "../../api/productService";
import { truncate, formatPrice } from "../../utils/formatters";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart`);
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
      {/* Product Image */}
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
          src={productService.getPhotoUrl(product._id)}
          alt={product.name}
          loading="lazy"
          className="product-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: "20px",
            transition: "transform 0.4s ease",
          }}
        />
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
        {/* Product Name */}
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
          {product.name}
        </h3>

        {/* Description */}
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
          {truncate(product.description, 90)}
        </p>

        {/* Price */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "4px",
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
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => navigate(`/product/${product.slug}`)}
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
            className="details-btn"
          >
            Details
          </button>

          {!isAdmin && (
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "12px",
                border: "none",
                background: "var(--accent)",
                color: "#fff",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              className="cart-btn"
            >
              Add Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;