import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaWineBottle } from "react-icons/fa";
import {
  FaLaptop,
  FaTshirt,
  FaShoePrints,
  FaClock,
  FaGem,
  FaBasketballBall,
  FaCouch,
  FaBook,
  FaGamepad,
  FaShoppingBasket,
  FaShoppingCart,
} from "react-icons/fa";

import { MdOutlineDevicesOther } from "react-icons/md";

import Layout from "../../components/Layout/Layout";
import categoryService from "../../api/categoryService";

const ICONS = {
  electronics: <FaLaptop />,
  tech: <FaLaptop />,
  computers: <MdOutlineDevicesOther />,

  fashion: <FaTshirt />,
  clothing: <FaTshirt />,
  clothes: <FaTshirt />,

  shoes: <FaShoePrints />,
  footwear: <FaShoePrints />,

  accessories: <FaClock />,
  watches: <FaClock />,

  jewellery: <FaGem />,
  jewelry: <FaGem />,

  beauty: <FaGem />,
  cosmetics: <FaGem />,

  sports: <FaBasketballBall />,
  fitness: <FaBasketballBall />,

  home: <FaCouch />,
  furniture: <FaCouch />,

  books: <FaBook />,

  toys: <FaGamepad />,

  grocery: <FaShoppingBasket />,
  food: <FaShoppingBasket />,

  bottles: <FaWineBottle />,
};

const getIcon = (name = "") => {
  const key = name.toLowerCase();

  for (const [k, v] of Object.entries(ICONS)) {
    if (key.includes(k)) return v;
  }

  return <FaShoppingCart />;
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then(({ data }) => {
        if (data?.success) {
          setCategories(data.category || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout title="All Categories — EliteMart">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "-0.02em",
            }}
          >
            All Categories
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "var(--ink-soft)",
              marginTop: 6,
            }}
          >
            Browse products by category
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 20,
          }}
        >
          {/* All Products Card */}
          <Link to="/products" style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{
                padding: "2rem 1rem",
                textAlign: "center",
                cursor: "pointer",
                height: "100%",
                border: "1px solid var(--stone)",
                borderRadius: 20,
                transition: "all .25s ease",
                background: "#fff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--stone)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                  color: "var(--accent)",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <FaShoppingCart />
              </div>

              <h3
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                All Products
              </h3>

              <p
                style={{
                  fontSize: 12,
                  color: "var(--ink-soft)",
                }}
              >
                View everything
              </p>
            </div>
          </Link>

          {/* Loading Skeletons */}
          {loading &&
            [...Array(6)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 180,
                  background: "#f3f4f6",
                  borderRadius: 20,
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
            ))}

          {/* Category Cards */}
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
                    padding: "2rem 1rem",
                    textAlign: "center",
                    cursor: "pointer",
                    height: "100%",
                    border: "1px solid var(--stone)",
                    borderRadius: 20,
                    transition: "all .25s ease",
                    background: "#fff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 30px rgba(0,0,0,.08)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--stone)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "1rem",
                      color: "var(--accent)",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {getIcon(c.name)}
                  </div>

                  {/* Name */}
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--ink)",
                      marginBottom: 4,
                    }}
                  >
                    {c.name}
                  </h3>

                  {/* Slug */}
                  <p
                    style={{
                      fontSize: 12,
                      color: "var(--ink-soft)",
                      textTransform: "capitalize",
                    }}
                  >
                    {c.slug}
                  </p>
                </div>
              </Link>
            ))}
        </div>

        {/* Empty State */}
        {!loading && categories.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "6rem 0",
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                marginBottom: "1rem",
              }}
            >
              📂
            </div>

            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              No categories found
            </h3>

            <p
              style={{
                color: "var(--ink-soft)",
                fontSize: 14,
                marginTop: 6,
              }}
            >
              Categories will appear here once created.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoriesPage;
