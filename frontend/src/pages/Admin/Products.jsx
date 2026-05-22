import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import ProductCard from "../../components/common/ProductCard";
import productService from "../../api/productService";
import { truncate } from "../../utils/formatters";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "../../store/slices/authSlice";

const Products = () => {
  const isAdmin = useSelector(selectIsAdmin);

  const [adminProducts, setAdminProducts] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const totalRef = useRef(0);
  const productsRef = useRef([]);
  useEffect(() => {
    totalRef.current = total;
  }, [total]);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  // Admin: load all products once
  useEffect(() => {
    if (!isAdmin) return;
    setAdminLoading(true);
    productService
      .getAll()
      .then(({ data }) => {
        if (data?.success) setAdminProducts(data.products);
      })
      .catch(() => toast.error("Failed to load products"))
      .finally(() => setAdminLoading(false));
  }, [isAdmin]);

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

  const fetchPage = async (pageNum, append, knownTotal) => {
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
    if (isAdmin) return;
    (async () => {
      const t = await fetchTotal();
      await fetchPage(1, false, t);
    })();
  }, [isAdmin]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPage(next, true);
  };

  const Skeleton = () => (
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
  );

  // ADMIN VIEW
  if (isAdmin)
    return (
      <Layout title="All Products — Admin">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <AdminMenu />
            </div>
            <div className="md:col-span-3">
              <p
                 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-.02em",
            }}
          >
                All Products ({adminProducts.length})
              </p>

              {adminLoading ? (
                <Skeleton />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {adminProducts.map((p) => (
                    <Link
                      key={p._id}
                      to={`/dashboard/admin/product/${p.slug}`}
                      className="card group"
                      style={{ textDecoration: "none" }}
                    >
                      <img
                        src={productService.getPhotoUrl(p._id)}
                        alt={p.name}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: 176,
                          objectFit: "contain",
                          background: "var(--cream)",
                          padding: 8,
                        }}
                      />
                      <div style={{ padding: "12px 14px" }}>
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: 14,
                            color: "var(--ink)",
                            marginBottom: 4,
                          }}
                          className="group-hover:text-primary transition-colors"
                        >
                          {p.name}
                        </p>
                        <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                          {truncate(p.description, 60)}
                        </p>
                        <span
                          style={{
                            display: "inline-block",
                            marginTop: 8,
                            fontSize: 11,
                            background: "var(--accent-lt)",
                            color: "var(--accent)",
                            padding: "2px 10px",
                            borderRadius: 20,
                            fontWeight: 600,
                          }}
                        >
                          Edit →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    );

  // USER VIEW — paginated, shows ALL products
  return (
    <Layout title="All Products — EliteMart">
      <div className="max-w-7xl mx-auto px-4 py-10">
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
            All Products
          </h1>
        </div>

        {loading && products.length === 0 && <Skeleton />}

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
                `Load More (${products.length} of ${total})`
              )}
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Products;
