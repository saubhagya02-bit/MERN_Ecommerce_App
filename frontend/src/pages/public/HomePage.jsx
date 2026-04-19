import { useState, useEffect } from "react";
import { Radio } from "antd";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import productService from "../../api/productService";
import useCategory from "../../hooks/useCategory";
import { PRICE_RANGES } from "../../utils/constants";

// Banner images — put your own in src/assets/images/
const BANNERS = [
  "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1400&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1400&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80",
  "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1400&q=80",
];

const HomePage = () => {
  const categories = useCategory();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState(null);
  const [bannerIdx, setBannerIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setBannerIdx((i) => (i + 1) % BANNERS.length),
      3500,
    );
    return () => clearInterval(t);
  }, []);

  const fetchProducts = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const { data } = await productService.getList(pageNum);
      setProducts((prev) =>
        append ? [...prev, ...data.products] : data.products || [],
      );
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchTotal = async () => {
    const { data } = await productService.getCount();
    setTotal(data?.total || 0);
  };

  const filterProducts = async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const { data } = await productService.filter(checked, radio);
      setProducts((prev) =>
        append ? [...prev, ...data.products] : data.products || [],
      );
    } catch {
      toast.error("Filter failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
    fetchTotal();
  }, []);

  useEffect(() => {
    setPage(1);
    if (checked.length || radio) {
      filterProducts(1);
    } else {
      fetchProducts(1);
    }
  }, [checked, radio]);

  const handleCategoryCheck = (id, value) => {
    setChecked((prev) =>
      value ? [...prev, id] : prev.filter((c) => c !== id),
    );
  };

  const handleLoadMore = async () => {
    const next = page + 1;
    setPage(next);
    if (checked.length || radio) {
      filterProducts(next, true);
    } else {
      fetchProducts(next, true);
    }
  };

  const resetFilters = () => {
    setChecked([]);
    setRadio(null);
    setPage(1);
    fetchProducts(1);
  };

  return (
    <Layout title="EShop — All Products">
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
            Welcome to EShop
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
              <h3 className="font-bold text-gray-800 mb-4">Filter by Price</h3>
              <Radio.Group
                value={radio}
                onChange={(e) => setRadio(e.target.value)}
                className="flex flex-col gap-2"
              >
                {PRICE_RANGES.map((p) => (
                  <Radio
                    key={p._id}
                    value={p.array}
                    className="text-sm text-gray-600"
                  >
                    {p.name}
                  </Radio>
                ))}
              </Radio.Group>

              <h3 className="font-bold text-gray-800 mt-6 mb-3">
                Filter by Category
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((c) => (
                  <label
                    key={c._id}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
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

          <div className="md:col-span-3">
            <h2 className="text-xl font-bold text-gray-800 mb-5">
              All Products
            </h2>
            <div className="flex flex-wrap gap-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {products.length === 0 && !loading && (
              <p className="text-gray-500 text-center py-16">
                No products found.
              </p>
            )}

            {products.length < total && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-outline px-8 py-3"
                >
                  {loading ? "Loading..." : "Load More"}
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
