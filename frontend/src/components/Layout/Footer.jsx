import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <p className="text-lg font-semibold text-white mb-2">🛒 EShop</p>
      <p className="text-sm mb-4">
        All Rights Reserved &copy; {new Date().getFullYear()} EShop
      </p>
      <div className="flex justify-center gap-6 text-sm">
        <Link to="/about" className="hover:text-white transition-colors">
          About Us
        </Link>
        <Link to="/contact" className="hover:text-white transition-colors">
          Contact
        </Link>
        <Link to="/policy" className="hover:text-white transition-colors">
          Privacy Policy
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
