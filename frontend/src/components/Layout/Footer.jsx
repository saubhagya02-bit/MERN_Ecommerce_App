import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => (
  <footer style={{ background: "var(--ink)", color: "var(--ink-faint)" }}>
    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Brand */}
      <div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "#fff",
            marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}
        >
          EliteMart
        </p>
        <p className="text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
          Your one-stop destination for fashion, electronics, and lifestyle
          products. Shop smarter, live better.
        </p>
      </div>

      {/* Links */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--stone-dark)" }}
        >
          Quick Links
        </p>
        <ul className="flex flex-col gap-2 text-sm">
          {[
            { to: "/about", label: "About Us" },
            { to: "/contact", label: "Contact" },
            { to: "/policy", label: "Privacy Policy" },
          ].map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className="transition-colors hover:text-white"
                style={{ color: "var(--ink-soft)" }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Social */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: "var(--stone-dark)" }}
        >
          Follow Us
        </p>
        <div className="flex gap-4">
          {[
            {
              Icon: FaFacebook,
              href: "https://facebook.com",
              label: "Facebook",
            },
            {
              Icon: FaInstagram,
              href: "https://instagram.com",
              label: "Instagram",
            },
            {
              Icon: FaWhatsapp,
              href: "https://whatsapp.com",
              label: "WhatsApp",
            },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-xl transition-colors hover:text-white"
              style={{ color: "var(--ink-soft)" }}
            >
              <Icon />
            </a>
          ))}
        </div>
        <p className="text-xs mt-4" style={{ color: "var(--ink-soft)" }}>
          Stay connected for offers &amp; updates.
        </p>
      </div>
    </div>

    <div
      className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2"
      style={{
        borderTop: "1px solid rgba(255,255,255,.08)",
        fontSize: "0.75rem",
        color: "var(--ink-soft)",
      }}
    >
      <span>© {new Date().getFullYear()} EliteMart. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;
