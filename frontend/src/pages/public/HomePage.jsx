import { useState, useEffect, useCallback } from "react";
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

// Banner images
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
      setTotal(data?.total || 0);
    } catch {
      console.error("Failed to fetch total");
    }
  };

  const fetchProducts = useCallback(
    async (pageNum = 1, append = false) => {
      setLoading(true);
      try {
        const { data } = await productService.getList(pageNum);
        const newProducts = data?.products || [];

        setProducts((prev) =>
          append ? [...prev, ...newProducts] : newProducts,
        );

        setHasMore(
          append
            ? products.length + newProducts.length < total
            : newProducts.length < total,
        );
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    },
    [total, products.length],
  );

  const fetchFiltered = useCallback(
    async (pageNum = 1, append = false) => {
      setLoading(true);
      try {
        const { data } = await productService.filter(
          checked,
          radio,
          pageNum,
          PER_PAGE,
        );
        const newProducts = data?.products || [];
        const filteredTotal = data?.total || newProducts.length;

        setProducts((prev) =>
          append ? [...prev, ...newProducts] : newProducts,
        );

        const loadedSoFar = append
          ? products.length + newProducts.length
          : newProducts.length;

        setHasMore(loadedSoFar < filteredTotal);
        setTotal(filteredTotal);
      } catch {
        toast.error("Filter failed");
      } finally {
        setLoading(false);
      }
    },
    [checked, radio, products.length],
  );

  // Initial load
  useEffect(() => {
    fetchProducts(1);
    fetchTotal();
  }, []);

  useEffect(() => {
    setPage(1);
    setProducts([]);
    if (isFiltered) {
      fetchFiltered(1, false);
    } else {
      fetchProducts(1, false);
      fetchTotal();
    }
  }, [checked, radio]);

  //  Load More
  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    if (isFiltered) {
      fetchFiltered(next, true);
    } else {
      fetchProducts(next, true);
    }
  };

  //  Handlers
  const handleCategoryCheck = (id, value) => {
    setChecked((prev) =>
      value ? [...prev, id] : prev.filter((c) => c !== id),
    );
  };

  const resetFilters = () => {
    setChecked([]);
    setRadio(null);
    setPage(1);
    setProducts([]);
  };

  return (
    <Layout title="EliteMart — All Products">
      {/* Hero Banner */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {BANNERS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`banner-${i}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === bannerIdx ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Welcome to EliteMart
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-xl">
            Tech, fashion, home &amp; more — shop faster, live better.
          </p>
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {BANNERS.map((_, i) => (
            <button
              key={i}
              onClick={() => setBannerIdx(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i === bannerIdx ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sticky top-20">
              {/* Price filter */}
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
                Filter by Price
              </h3>
              <Radio.Group
                value={radio}
                onChange={(e) => setRadio(e.target.value)}
                className="flex flex-col gap-2"
              >
                {PRICE_RANGES.map((p) => (
                  <Radio
                    key={p._id}
                    value={p.array}
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>

              {/* Category filter */}
              <h3 className="font-bold text-gray-800 dark:text-gray-100 mt-6 mb-3">
                Filter by Category
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked.includes(c._id)}
                      onChange={(e) =>
                        handleCategoryCheck(c._id, e.target.checked)
                      }
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    {c.name}
                  </label>
                ))}
              </div>

              <button
                onClick={resetFilters}
                className="btn-danger w-full mt-5 text-sm"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* Product grid */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {isFiltered
                  ? `Filtered Products (${total})`
                  : `All Products (${total})`}
              </h2>
              {isFiltered && (
                <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  Filters active
                </span>
              )}
            </div>

            {loading && products.length === 0 && (
              <div className="flex flex-wrap gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-64 h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            )}

            {/* Products */}
            <div className="flex flex-wrap gap-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {products.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-500 dark:text-gray-400">
                  No products found for this filter.
                </p>
                <button onClick={resetFilters} className="btn-primary mt-4">
                  Clear Filters
                </button>
              </div>
            )}

            {/* Load More button */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-outline px-8 py-3"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}

            {!hasMore && products.length > 0 && (
              <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8">
                ✅ All {products.length} products loaded
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
