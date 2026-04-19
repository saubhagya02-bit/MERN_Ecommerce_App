import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import productService from "../../api/productService";
import { addToCart } from "../../store/slices/cartSlice";
import { formatPrice } from "../../utils/formatters";

const ProductDetails = () => {
  const { slug }    = useParams();
  const dispatch    = useDispatch();
  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    if (slug) fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getOne(slug);
      setProduct(data?.product);
      if (data?.product?._id && data?.product?.category?._id) {
        const { data: rel } = await productService.getRelated(
          data.product._id,
          data.product.category._id
        );
        setRelated(rel?.products || []);
      }
    } catch {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout><p className="text-center py-16 text-gray-500">Product not found.</p></Layout>
    );
  }

  return (
    <Layout title={product.name}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Product detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-6 min-h-64">
            <img
              src={productService.getPhotoUrl(product._id)}
              alt={product.name}
              className="max-h-72 object-contain"
            />
          </div>
          <div className="flex flex-col justify-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
            <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
            <span className="inline-block text-xs bg-blue-50 text-primary px-3 py-1 rounded-full w-fit font-medium">
              {product.category?.name}
            </span>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            <div className="flex gap-3 mt-2">
              <span className="text-sm text-gray-500">In stock: {product.quantity}</span>
              <span className="text-sm text-gray-500">
                Shipping: {product.shipping ? "✅ Yes" : "❌ No"}
              </span>
            </div>
            <button
              onClick={() => {
                dispatch(addToCart(product));
                toast.success("Added to cart!");
              }}
              className="btn-primary py-3 mt-2 w-full md:w-auto"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-800 mb-5">Similar Products</h2>
            <div className="flex flex-wrap gap-4">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;