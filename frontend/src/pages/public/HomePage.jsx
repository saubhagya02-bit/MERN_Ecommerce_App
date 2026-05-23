import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  HiArrowRight,
  HiLightningBolt,
  HiStar,
  HiShieldCheck,
  HiTruck,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";

import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import productService from "../../api/productService";

import accessoriesBanner from "../../assets/images/Accessories-banner.png";
import clothBanner from "../../assets/images/Cloth-banner.png";
import cosmaticsBanner from "../../assets/images/Cosmatics-banner.png";
import electronicsBanner from "../../assets/images/Electronics-banner.png";

import useCategory from "../../hooks/useCategory";

/* BANNERS */
const BANNERS = [
  {
    image: electronicsBanner,
    title: "Premium Electronics",
    subtitle:
      "Discover cutting-edge gadgets and smart devices at unbeatable prices.",
    button: "Shop Electronics",
    link: "/category/electronics",
  },
  {
    image: clothBanner,
    title: "Fashion Collection",
    subtitle:
      "Upgrade your wardrobe with the latest trends and timeless styles.",
    button: "Shop Fashion",
    link: "/category/fashion",
  },
  {
    image: cosmaticsBanner,
    title: "Beauty & Cosmetics",
    subtitle:
      "Glow with premium skincare and beauty essentials curated for you.",
    button: "Shop Beauty",
    link: "/category/cosmatics",
  },
  {
    image: accessoriesBanner,
    title: "Accessories & More",
    subtitle:
      "Complete your look with stylish accessories and lifestyle products.",
    button: "Shop Accessories",
    link: "/category/accessories",
  },
];

const TRUST = [
  {
    icon: <HiTruck style={{ fontSize: 22, color: "var(--accent)" }} />,
    label: "Free Shipping",
    sub: "On orders over $50",
  },
  {
    icon: <HiShieldCheck style={{ fontSize: 22, color: "var(--accent)" }} />,
    label: "Secure Payments",
    sub: "SSL encrypted checkout",
  },
  {
    icon: <HiStar style={{ fontSize: 22, color: "#F59E0B" }} />,
    label: "Top Rated",
    sub: "4.8★ from 10k+ reviews",
  },
  {
    icon: <HiLightningBolt style={{ fontSize: 22, color: "var(--accent)" }} />,
    label: "Fast Delivery",
    sub: "2–5 business days",
  },
];

const HomePage = () => {
  const categories = useCategory();

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

  /* AUTO SLIDER */
  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIdx((prev) => (prev + 1) % BANNERS.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  /* PRODUCTS */
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
      const { data } = await productService.getList(pageNum, 8);

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

  const currentBanner = BANNERS[bannerIdx];

  return (
    <Layout title="EliteMart — Shop All Products">
      <div style={{ marginTop: 0, paddingTop: 0 }}>
        {/* HERO SECTIO */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "72vh",
            minHeight: 450,
            overflow: "hidden",
            borderRadius: "0 0 32px 32px",
          }}
        >
          {/* Images */}
          {BANNERS.map((banner, i) => (
            <img
              key={i}
              src={banner.image}
              alt={banner.title}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: i === bannerIdx ? 1 : 0,
                transform: i === bannerIdx ? "scale(1)" : "scale(1.08)",
                transition: "all 1s ease",
              }}
            />
          ))}

          {/* Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to right, rgba(0,0,0,.78), rgba(0,0,0,.25))",
            }}
          />

          {/* Content */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              maxWidth: 1300,
              margin: "0 auto",
              padding: "0 5%",
              zIndex: 5,
            }}
          >
            <div
              style={{
                maxWidth: 620,
                color: "#fff",
                animation: "fadeUp .8s ease",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  padding: "6px 18px",
                  borderRadius: 40,
                  background: "rgba(255,255,255,.12)",
                  border: "1px solid rgba(255,255,255,.2)",
                  backdropFilter: "blur(8px)",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  marginBottom: 18,
                }}
              >
                EliteMart Collection
              </span>

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem,6vw,5rem)",
                  lineHeight: 1.05,
                  fontWeight: 700,
                  marginBottom: 20,
                  textShadow: "0 4px 30px rgba(0,0,0,.4)",
                }}
              >
                {currentBanner.title}
              </h1>

              <p
                style={{
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,.85)",
                  maxWidth: 520,
                  marginBottom: 32,
                }}
              >
                {currentBanner.subtitle}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 14,
                  flexWrap: "wrap",
                }}
              >
                <Link
                  to={currentBanner.link}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 30px",
                    borderRadius: 14,
                    background: "#fff",
                    color: "#000",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: ".25s",
                  }}
                >
                  {currentBanner.button}
                  <HiArrowRight />
                </Link>

                <Link
                  to="/products"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "14px 28px",
                    borderRadius: 14,
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,.3)",
                    background: "rgba(255,255,255,.08)",
                    backdropFilter: "blur(8px)",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  Browse All
                </Link>
              </div>
            </div>
          </div>

          {/* Left Arrow */}
          <button
            onClick={() =>
              setBannerIdx((prev) =>
                prev === 0 ? BANNERS.length - 1 : prev - 1,
              )
            }
            style={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,.15)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HiChevronLeft />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => setBannerIdx((prev) => (prev + 1) % BANNERS.length)}
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              width: 50,
              height: 50,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,.15)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              fontSize: 24,
              cursor: "pointer",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <HiChevronRight />
          </button>

          {/* Dots */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 10,
              zIndex: 10,
            }}
          >
            {BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setBannerIdx(i)}
                style={{
                  width: i === bannerIdx ? 34 : 10,
                  height: 10,
                  borderRadius: 30,
                  border: "none",
                  cursor: "pointer",
                  transition: "all .3s ease",
                  background:
                    i === bannerIdx ? "#fff" : "rgba(255,255,255,.45)",
                }}
              />
            ))}
          </div>

          {/* Animation */}
          <style>{`
          @keyframes fadeUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            0% { opacity: .6; }
            50% { opacity: 1; }
            100% { opacity: .6; }
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: 18,
            }}
          >
            {TRUST.map((item, i) => (
              <div
                key={i}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 18,
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                {item.icon}

                <div>
                  <h4
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {item.label}
                  </h4>

                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {item.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div
            style={{
              marginBottom: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                Featured Products
              </h2>

              <p
                style={{
                  color: "var(--ink-soft)",
                }}
              >
                Discover our latest and most popular items.
              </p>
            </div>
          </div>

          {loading && products.length === 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    height: 320,
                    borderRadius: 20,
                    background: "var(--stone)",
                    animation: "pulse 1.5s infinite",
                  }}
                />
              ))}
            </div>
          )}

          {/* Product Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 24,
            }}
          >
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

          {/* Empty */}
          {!loading && products.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
              }}
            >
              <p
                style={{
                  fontSize: "4rem",
                  marginBottom: "1rem",
                }}
              >
                🛍️
              </p>

              <p
                style={{
                  color: "var(--ink-soft)",
                }}
              >
                No products available yet.
              </p>
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "3rem",
              }}
            >
              <button
                onClick={handleLoadMore}
                disabled={loading}
                className="btn-outline"
                style={{
                  padding: "12px 42px",
                  borderRadius: 14,
                }}
              >
                {loading ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span
                      style={{
                        width: 15,
                        height: 15,
                        border: "2px solid var(--accent)",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin .7s linear infinite",
                      }}
                    />
                    Loading...
                  </span>
                ) : (
                  "Load More"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
