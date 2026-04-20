import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "antd";
import toast from "react-hot-toast";
import {
  logout,
  selectCurrentUser,
  selectIsAdmin,
} from "../../store/slices/authSlice";
import { selectCartCount } from "../../store/slices/cartSlice";
import useCategory from "../../hooks/useCategory";
import SearchInput from "../Form/SearchInput";
import { HiShoppingCart, HiMenu, HiX } from "react-icons/hi";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const isAdmin = useSelector(selectIsAdmin);
  const cartCount = useSelector(selectCartCount);
  const categories = useCategory();

  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Brand */}
        <NavLink
          to="/"
          className="text-xl font-bold tracking-widest text-primary"
        >
          🛒 EliteMart
        </NavLink>

        <div className="hidden md:flex items-center gap-6">
          <SearchInput />

          <NavLink
            to="/"
            className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
          >
            Home
          </NavLink>

          <div className="relative">
            <button
              onClick={() => setCatOpen((o) => !o)}
              className="text-sm font-medium text-gray-700 hover:text-primary transition-colors flex items-center gap-1"
            >
              Categories ▾
            </button>
            {catOpen && (
              <div className="absolute top-8 left-0 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[180px] py-2 z-50">
                <Link
                  to="/categories"
                  onClick={() => setCatOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                >
                  All Categories
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    onClick={() => setCatOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {!user ? (
            <>
              <NavLink
                to="/register"
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                Register
              </NavLink>
              <NavLink to="/login" className="btn-primary text-sm">
                Login
              </NavLink>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    isAdmin
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {isAdmin ? "Admin" : "User"}
                </span>
                {user.name} ▾
              </button>

              {userOpen && (
                <div className="absolute top-9 right-0 bg-white rounded-xl shadow-lg border border-gray-100 min-w-[160px] py-2 z-50">
                  <Link
                    to={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
                    onClick={() => setUserOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {!isAdmin && (
            <NavLink to="/cart">
              <Badge count={cartCount} showZero>
                <HiShoppingCart className="text-2xl text-gray-700 hover:text-primary transition-colors" />
              </Badge>
            </NavLink>
          )}
        </div>

        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          <SearchInput />
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700"
          >
            Home
          </NavLink>
          <NavLink
            to="/categories"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-700"
          >
            Categories
          </NavLink>

          {!user ? (
            <>
              <NavLink
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-700"
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-700"
              >
                Login
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-700"
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-left text-sm text-red-500"
              >
                Logout
              </button>
            </>
          )}

          {!isAdmin && (
            <NavLink
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="text-sm text-gray-700"
            >
              Cart ({cartCount})
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
