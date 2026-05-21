import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import productService from "../../api/productService";
import { addToCart } from "../../store/slices/cartSlice";
import { selectIsAdmin } from "../../store/slices/authSlice";
import { formatPrice } from "../../utils/formatters";

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

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
          data.product.category._id,
        );
        setRelated(rel?.products || []);
      }
    } catch {
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
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

  return (
    <Layout title={`${product.name} — EliteMart`}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Product detail card */}
        <div
          className="panel"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2.5rem",
            padding: "2rem",
          }}
        >
          {/* Image */}
          <div
            style={{
              background: "var(--cream)",
              borderRadius: 14,
              padding: "2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 280,
            }}
          >
            <img
              src={productService.getPhotoUrl(product._id)}
              alt={product.name}
              style={{ maxHeight: 280, maxWidth: "100%", objectFit: "contain" }}
            />
          </div>

          {/* Info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
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

            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 600,
                color: "var(--accent)",
              }}
            >
              {formatPrice(product.price)}
            </p>

            {/* Category badge */}
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

            <p
              style={{ color: "var(--ink-mid)", lineHeight: 1.7, fontSize: 14 }}
            >
              {product.description}
            </p>

            {/* Stock & shipping */}
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                fontSize: 13,
                color: "var(--ink-soft)",
              }}
            >
              <span
                style={{
                  color: outOfStock ? "var(--danger)" : "var(--success)",
                  fontWeight: 500,
                }}
              >
                {outOfStock ? "Out of stock" : `In stock: ${product.quantity}`}
              </span>
              <span>Shipping: {product.shipping ? "✅ Yes" : "❌ No"}</span>
            </div>

            {/* Add to Cart — hidden for admin, disabled when out of stock */}
            {!isAdmin && (
              <button
                onClick={() => {
                  dispatch(addToCart(product));
                  toast.success(`${product.name} added to cart`);
                }}
                disabled={outOfStock}
                className="btn-primary"
                style={{
                  padding: "12px 0",
                  fontSize: 15,
                  marginTop: "0.5rem",
                  opacity: outOfStock ? 0.4 : 1,
                  cursor: outOfStock ? "not-allowed" : "pointer",
                }}
              >
                {outOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div style={{ marginTop: "3rem" }}>
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
