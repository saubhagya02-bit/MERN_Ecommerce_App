import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">🛒 EliteMart</h2>
          <p className="text-sm leading-6 text-gray-400">
            Your one-stop online shopping destination for fashion, electronics
            and lifestyle products. Shop smarter, live better.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/policy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4 text-xl">
            <a href="#" className="hover:text-white transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaWhatsapp />
            </a>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Stay connected for latest offers & updates.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 mt-10 py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} EliteMart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
