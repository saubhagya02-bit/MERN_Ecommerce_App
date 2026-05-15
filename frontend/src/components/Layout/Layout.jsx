import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({
  children,
  title = "EliteMart",
  description = "MERN Stack Ecommerce",
  keywords = "MERN, React, MongoDB",
  author = "EliteMart",
}) => (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <title>{title}</title>
    </Helmet>

    <Header />

    <main className="flex-1 pt-16">{children}</main>

    <Footer />
  </div>
);

export default Layout;
