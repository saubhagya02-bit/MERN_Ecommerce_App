import { useState, useEffect, useRef } from "react";
import { Radio } from "antd";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import productService from "../../api/productService";
import useCategory from "../../hooks/useCategory";
import { PRICE_RANGES } from "../../utils/constants";
import accessoriesBanner from "../../assets/images/Accessories-banner.png";
import clothBanner from "../../assets/images/Cloth-banner.png";
import cosmaticsBanner from "../../assets/images/Cosmatics-banner.png";
import electronicsBanner from "../../assets/images/Electronics-banner.png";

const BANNERS = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80",
  accessoriesBanner,
  clothBanner,
  cosmaticsBanner,
  electronicsBanner,
];

const PER_PAGE = 6;

const HomePage = () => {
  const categories = useCategory();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState(null);
  const [bannerIdx, setBannerIdx] = useState(0);

  const isFiltered = checked.length > 0 || radio !== null;

  const productsRef = useRef(products);
  const totalRef = useRef(total);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);
  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  useEffect(() => {
    const t = setInterval(
      () => setBannerIdx((i) => (i + 1) % BANNERS.length),
      3500,
    );
    return () => clearInterval(t);
  }, []);

  const fetchTotal = async () => {
    try {
      const { data } = await productService.getCount();
      const t = data?.total || 0;
      setTotal(t);
      return t;
    } catch {
      return 0;
    }
  };

  const fetchProducts = async (pageNum, append, knownTotal) => {
    setLoading(true);
    try {
      const { data } = await productService.getList(pageNum);
      const fresh = data?.products || [];
      setProducts((prev) => (append ? [...prev, ...fresh] : fresh));
      const loaded = append
        ? productsRef.current.length + fresh.length
        : fresh.length;
      setHasMore(loaded < (knownTotal ?? totalRef.current));
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltered = async (pageNum, append) => {
    setLoading(true);
    try {
      const { data } = await productService.filter(
        checked,
        radio,
        pageNum,
        PER_PAGE,
      );
      const fresh = data?.products || [];
      const newTotal = data?.total || fresh.length;
      setTotal(newTotal);
      setProducts((prev) => (append ? [...prev, ...fresh] : fresh));
      const loaded = append
        ? productsRef.current.length + fresh.length
        : fresh.length;
      setHasMore(loaded < newTotal);
    } catch {
      toast.error("Filter failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const t = await fetchTotal();
      await fetchProducts(1, false, t);
    })();
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
    setProducts([]);
    if (isFiltered) {
      fetchFiltered(1, false);
    } else {
      fetchTotal().then((t) => fetchProducts(1, false, t));
    }
  }, [checked, radio]);
  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    if (isFiltered) fetchFiltered(next, true);
    else fetchProducts(next, true);
  };

  const handleCategoryCheck = (id, value) =>
    setChecked((prev) =>
      value ? [...prev, id] : prev.filter((c) => c !== id),
    );

  const resetFilters = () => {
    setChecked([]);
    setRadio(null);
  };

  // Render
  return (
    <Layout title="EliteMart — All Products">
      {/* Hero banner */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "60vh",
          overflow: "hidden",
        }}
      >
        {BANNERS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: i === bannerIdx ? 1 : 0,
              transition: "opacity 1s",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,.38)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textAlign: "center",
            padding: "0 1rem",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem,6vw,3.5rem)",
              fontWeight: 700,
              marginBottom: "0.75rem",
              textShadow: "0 2px 12px rgba(0,0,0,.4)",
            }}
          >
            Welcome to EliteMart
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: 480 }}>
            Tech, fashion, home &amp; more — shop smarter, live better.
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
          }}
        >
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: i === bannerIdx ? "#fff" : "rgba(255,255,255,.4)",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <div className="panel" style={{ position: "sticky", top: "5rem" }}>
              <p className="label-xs mb-3">Filter by Price</p>
              <Radio.Group
                value={radio}
                onChange={(e) => setRadio(e.target.value)}
                style={{ display: "flex", flexDirection: "column", gap: 8 }}
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

              <div className="divider" style={{ margin: "1rem 0" }} />

              <p className="label-xs mb-3">Filter by Category</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {categories.map((c) => (
                  <label
                    key={c._id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--ink-mid)",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked.includes(c._id)}
                      onChange={(e) =>
                        handleCategoryCheck(c._id, e.target.checked)
                      }
                      style={{
                        accentColor: "var(--accent)",
                        width: 14,
                        height: 14,
                      }}
                    />
                    {c.name}
                  </label>
                ))}
              </div>

              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="btn-danger w-full mt-5"
                  style={{ fontSize: 12, padding: "7px 0" }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </aside>

          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--ink)",
                }}
              >
                {isFiltered ? `Filtered (${total})` : `All Products (${total})`}
              </p>
              {isFiltered && (
                <span className="badge badge-warn">Filters active</span>
              )}
            </div>

            {loading && products.length === 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
                  gap: 16,
                }}
              >
                {[...Array(6)].map((_, i) => (
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
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
                gap: 16,
              }}
            >
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {products.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</p>
                <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
                  No products match this filter.
                </p>
                <button
                  onClick={resetFilters}
                  className="btn-primary"
                  style={{ marginTop: "1rem" }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {hasMore && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-outline"
                  style={{ padding: "10px 40px" }}
                >
                  {loading ? (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          border: "2px solid var(--accent)",
                          borderTopColor: "transparent",
                          borderRadius: "50%",
                          animation: "spin .7s linear infinite",
                          display: "inline-block",
                        }}
                      />
                      Loading…
                    </span>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
