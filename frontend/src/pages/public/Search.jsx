import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import { selectResults, selectKeyword } from "../../store/slices/searchSlice";

const Search = () => {
  const results = useSelector(selectResults);
  const keyword = useSelector(selectKeyword);

  return (
    <Layout title="Search Results">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Search Results</h1>
          <p className="text-gray-500 mt-1">
            {results.length === 0
              ? `No products found for "${keyword}"`
              : `Found ${results.length} product${results.length > 1 ? "s" : ""} for "${keyword}"`}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500">Try a different keyword.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
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