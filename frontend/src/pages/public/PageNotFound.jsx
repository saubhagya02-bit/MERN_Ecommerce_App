import { Link } from "react-router-dom";
import Layout from "../../components/Layout/Layout";

const PageNotFound = () => (
  <Layout title="404 — Page Not Found">
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-extrabold text-primary opacity-20 leading-none select-none">
        404
      </h1>
      <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
        Oops! Page Not Found
      </h2>
      <p className="text-gray-500 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn-primary px-8 py-3 text-base"
      >
        ← Go Back Home
      </Link>
    </div>
  </Layout>
);

export default PageNotFound;