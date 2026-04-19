import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import ProductCard from "../../components/common/ProductCard";
import productService from "../../api/productService";

const CategoryProduct = () => {
  const { slug } = useParams();
  const [products,  setProducts]  = useState([]);
  const [category,  setCategory]  = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (slug) fetchProducts();
  }, [slug]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getByCategory(slug);
      setProducts(data?.products || []);
      setCategory(data?.category || null);
    } catch {
      toast.error("Failed to load category products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={category ? `${category.name} Products` : "Category"}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {category?.name || "Category"}
          </h1>
          <p className="text-gray-500 mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500 py-16">
            No products in this category yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryProduct;