import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import { selectResults, selectKeyword } from "../../store/slices/searchSlice";

const Search = () => {
  const results = useSelector(selectResults);
  const keyword = useSelector(selectKeyword);

  return (
    <Layout title={`Search: "${keyword}" — EliteMart`}>
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
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
            Search Results
          </h1>
          <p
            style={{
              marginTop: "0.35rem",
              fontSize: 13,
              color: "var(--ink-soft)",
            }}
          >
            {results.length === 0
              ? `No products found for "${keyword}"`
              : `${results.length} product${results.length !== 1 ? "s" : ""} found for "${keyword}"`}
          </p>
        </div>

        {results.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔍</p>
            <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>
              Try a different keyword or browse all products.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
              gap: 16,
            }}
          >
            {results.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
