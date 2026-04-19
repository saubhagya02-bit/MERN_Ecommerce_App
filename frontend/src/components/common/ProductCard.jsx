import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../../store/slices/cartSlice";
import productService from "../../api/productService";
import { truncate, formatPrice } from "../../utils/formatters";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="card w-64 flex-shrink-0">
      <img
        src={productService.getPhotoUrl(product._id)}
        alt={product.name}
        className="w-full h-48 object-contain bg-gray-50 p-2"
      />
      <div className="p-4 flex flex-col gap-2">
        <h5 className="font-semibold text-gray-800 truncate">{product.name}</h5>
        <p className="text-sm text-gray-500">{truncate(product.description, 50)}</p>
        <p className="font-bold text-primary">{formatPrice(product.price)}</p>
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => navigate(`/product/${product.slug}`)}
            className="btn-outline text-xs flex-1"
          >
            Details
          </button>
          <button
            onClick={handleAddToCart}
            className="btn-primary text-xs flex-1"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;