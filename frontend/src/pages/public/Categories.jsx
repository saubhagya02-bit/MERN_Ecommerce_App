import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import useCategory from "../../hooks/useCategory";

const Categories = () => {
  const categories = useCategory();

  return (
    <Layout title="All Categories">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          All Categories
        </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c._id}
              to={`/category/${c.slug}`}
              className="card p-5 text-center font-medium text-gray-700 hover:text-primary hover:border-primary border-2 border-transparent transition-all"
            >
              <span className="text-3xl mb-2 block">🏷️</span>
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;