import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import categoryService from "../../api/categoryService";

const ICONS = {
  electronics: "💻",
  tech: "💻",
  computers: "🖥️",
  fashion: "👗",
  clothing: "👕",
  clothes: "👔",
  shoes: "👟",
  footwear: "👞",
  accessories: "⌚",
  watches: "⌚",
  jewellery: "💍",
  jewelry: "💍",
  beauty: "💄",
  cosmetics: "💄",
  skincare: "🧴",
  sports: "⚽",
  fitness: "🏋️",
  home: "🏠",
  furniture: "🛋️",
  books: "📚",
  toys: "🧸",
  food: "🍎",
  grocery: "🛒",
};

const getIcon = (name = "") => {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(ICONS)) {
    if (key.includes(k)) return v;
  }
  return "🛍️";
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then(({ data }) => {
        if (data?.success) setCategories(data.category || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="All Categories — EliteMart">
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
            All Categories
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>
            Browse products by category
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 16,
          }}
        >
          {/* All products card */}
          <Link to="/products" style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{
                padding: "1.5rem 1rem",
                textAlign: "center",
                cursor: "pointer",
                height: "100%",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--stone)")
              }
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                🛒
              </div>
              <p style={{ fontWeight: 600, fontSize: 14, color: "var(--ink)" }}>
                All Products
              </p>
              <p
                style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 3 }}
              >
                View everything
              </p>
            </div>
          </Link>

          {loading &&
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 140,
                  background: "var(--stone)",
                  borderRadius: 16,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}

          {/* Category cards */}
          {!loading &&
            categories.map((c) => (
              <Link
                key={c._id}
                to={`/category/${c.slug}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card"
                  style={{
                    padding: "1.5rem 1rem",
                    textAlign: "center",
                    cursor: "pointer",
                    height: "100%",
                    transition: "border-color .2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--stone)")
                  }
                >
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
                    {getIcon(c.name)}
                  </div>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: "var(--ink)",
                    }}
                  >
                    {c.name}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--ink-soft)",
                      marginTop: 3,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {c.slug}
                  </p>
                </div>
              </Link>
            ))}
        </div>

        {!loading && categories.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>📂</p>
            <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
              No categories yet.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesPage;
