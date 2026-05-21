import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../store/slices/cartSlice";
import { selectCurrentUser, selectIsAdmin } from "../../store/slices/authSlice";
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
    <div className="card flex flex-col">
      <div
        style={{
          background: "var(--cream)",
          height: 180,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <img
          src={productService.getPhotoUrl(product._id)}
          alt={product.name}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            padding: 12,
            transition: "transform .3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>

      <div
        className="flex flex-col gap-1.5 flex-1"
        style={{ padding: "12px 14px" }}
      >
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "var(--ink)" }}
        >
          {product.name}
        </p>
        <p
          className="text-xs leading-5 flex-1"
          style={{ color: "var(--ink-soft)" }}
        >
          {truncate(product.description, 55)}
        </p>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--accent)",
            margin: "4px 0",
          }}
        >
          {formatPrice(product.price)}
        </p>

        <div className="flex gap-2 mt-1">
          <button
            onClick={() => navigate(`/product/${product.slug}`)}
            className="btn-outline flex-1"
            style={{ fontSize: 11, padding: "5px 0" }}
          >
            Details
          </button>

          {!isAdmin && (
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1"
              style={{ fontSize: 11, padding: "5px 0" }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
