import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import AdminMenu from "../../components/Layout/AdminMenu";
import productService from "../../api/productService";
import { truncate } from "../../utils/formatters";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getAll()
      .then(({ data }) => {
        if (data?.success) setProducts(data.products);
      })
      .catch(() => toast.error("Failed to load products"));
  }, []);

  return (
    <Layout title="All Products">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <AdminMenu />
          </div>
          <div className="md:col-span-3">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              All Products ({products.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <Link
                  key={p._id}
                  to={`/dashboard/admin/product/${p.slug}`}
                  className="card group"
                >
                  <img
                    src={productService.getPhotoUrl(p._id)}
                    alt={p.name}
                    className="w-full h-44 object-contain bg-gray-50 p-2"
                  />
                  <div className="p-4">
                    <h5 className="font-semibold text-gray-800 group-hover:text-primary transition-colors">
                      {p.name}
                    </h5>
                    <p className="text-sm text-gray-500 mt-1">
                      {truncate(p.description, 60)}
                    </p>
                    <span className="inline-block mt-2 text-xs bg-blue-50 text-primary px-2 py-1 rounded-full font-medium">
                      Edit
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;