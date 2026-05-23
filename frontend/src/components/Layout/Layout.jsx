import { Helmet } from "react-helmet-async";
import Header from "./Header";
import Footer from "./Footer";

const TOP_BAR_H = "30px";

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
      <div style={{ height: TOP_BAR_H }} />

      <Header />

      <main
        style={{
          flex: 1,
          paddingTop: 0,
          marginTop: 0,
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
