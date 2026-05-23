import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Radio } from "antd";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import productService from "../../api/productService";
import { PRICE_RANGES } from "../../utils/constants";

const CategoryProduct = () => {
  const { slug } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [radio, setRadio] = useState(null);

  useEffect(() => {
    if (slug) fetchProducts();
  }, [slug]);

  useEffect(() => {
    if (!radio) {
      setProducts(allProducts);
    } else {
      const [min, max] = radio;
      setProducts(allProducts.filter((p) => p.price >= min && p.price <= max));
    }
  }, [radio, allProducts]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getByCategory(slug);
      setAllProducts(data?.products || []);
      setCategory(data?.category || null);
    } catch {
      toast.error("Failed to load category products");
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => setRadio(null);

  return (
    <Layout
      title={category ? `${category.name} — EliteMart` : "Category — EliteMart"}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-.02em",
            }}
          >
            {category?.name || "Category"}
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>
            {products.length} product{products.length !== 1 ? "s" : ""}
            {radio ? " matching filter" : ""}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* Price filter sidebar */}
          <aside>
            <div
              className="panel"
              style={{
                position: "sticky",
                top: "calc(var(--header-h, 4rem) + 1rem)",
              }}
            >
              <p className="label-xs" style={{ marginBottom: "0.75rem" }}>
                Filter by Price
              </p>

              <Radio.Group
                value={radio}
                onChange={(e) => setRadio(e.target.value)}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {PRICE_RANGES.map((p) => (
                  <Radio
                    key={p._id}
                    value={p.array}
                    style={{ fontSize: 13, color: "var(--ink-mid)" }}
                  >
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>

              {radio && (
                <>
                  <div className="divider" style={{ margin: "0.875rem 0" }} />
                  <button
                    onClick={resetFilter}
                    className="btn-danger w-full"
                    style={{ fontSize: 12, padding: "7px 0" }}
                  >
                    Clear Filter
                  </button>
                </>
              )}
            </div>
          </aside>

          {/* Product grid */}
          <div>
            {loading ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 16,
                }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 280,
                      background: "var(--stone)",
                      borderRadius: 16,
                      animation: "pulse 1.5s ease-in-out infinite",
                    }}
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 0" }}>
                <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</p>
                <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
                  {radio
                    ? "No products match this price range."
                    : "No products in this category yet."}
                </p>
                {radio && (
                  <button
                    onClick={resetFilter}
                    className="btn-primary"
                    style={{ marginTop: "1rem" }}
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "24px",
                  alignItems: "stretch",
                }}
              >
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryProduct;
