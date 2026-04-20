import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({
  children,
  title = "EShop",
  description = "MERN Stack Ecommerce",
  keywords = "MERN, React, MongoDB",
  author = "EShop",
}) => (
  <div className="flex flex-col min-h-screen">
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <title>{title}</title>
    </Helmet>

    <Header />

    <main className="flex-1 pt-16">
      {children}
    </main>

    <Footer />
  </div>
);

export default Layout;