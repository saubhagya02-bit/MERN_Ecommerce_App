import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import productService from "../../api/productService";
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

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [bannerIdx, setBannerIdx] = useState(0);

  const totalRef = useRef(0);
  const productsRef = useRef([]);
  useEffect(() => {
    totalRef.current = total;
  }, [total]);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  // Banner auto-advance
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

  useEffect(() => {
    (async () => {
      const t = await fetchTotal();
      await fetchProducts(1, false, t);
    })();
  }, []);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchProducts(next, true);
  };

  return (
    <Layout title="EliteMart — Shop All Products">
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
              fontSize: "clamp(2rem, 6vw, 3.5rem)",
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
        {/* Dots */}
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
                padding: 0,
                background: i === bannerIdx ? "#fff" : "rgba(255,255,255,.4)",
              }}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Skeleton */}
        {loading && products.length === 0 && (
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
        )}

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 16,
          }}
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</p>
            <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
              No products available yet.
            </p>
          </div>
        )}

        {/* Load more */}
        {hasMore && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2.5rem",
            }}
          >
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="btn-outline"
              style={{ padding: "10px 48px" }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
    </Layout>
  );
};

export default HomePage;
