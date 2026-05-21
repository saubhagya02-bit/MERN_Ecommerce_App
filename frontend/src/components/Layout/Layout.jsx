import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({
  children,
  title = "EliteMart",
  description = "Shop fashion, electronics and lifestyle products at EliteMart.",
  keywords = "ecommerce, fashion, electronics, lifestyle",
  author = "EliteMart",
}) => (
  <>
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <title>{title}</title>
    </Helmet>

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: "var(--cream)",

        overflowX: "hidden",
      }}
    >
      <Header />

      <main
        style={{
          flex: 1,
          paddingTop: "var(--header-h, 4rem)",

          minWidth: 0,
          width: "100%",
        }}
      >
        {children}
      </main>

      <Footer />
    </div>
  </>
);

export default Layout;
