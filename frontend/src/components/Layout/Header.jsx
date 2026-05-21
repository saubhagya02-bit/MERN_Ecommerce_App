import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "antd";
import toast from "react-hot-toast";
import {
  logout,
  selectCurrentUser,
  selectIsAdmin,
} from "../../store/slices/authSlice";
import { selectCartCount, resetCart } from "../../store/slices/cartSlice";
import useCategory from "../../hooks/useCategory";
import SearchInput from "../Form/SearchInput";
import { HiShoppingCart, HiMenu, HiX, HiChevronDown } from "react-icons/hi";

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

  const catRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target))
        setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const dropdownBase = [
    "absolute top-full mt-2 bg-white border border-[var(--stone)] rounded-xl",
    "shadow-[var(--shadow-lg)] py-1.5 z-50 min-w-[180px]",
    "animate-fade-in",
  ].join(" ");

  const dropItem = [
    "block px-4 py-2 text-sm text-[var(--ink-mid)]",
    "hover:bg-[var(--cream)] hover:text-[var(--accent)] transition-colors",
  ].join(" ");

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50"
      style={{ height: "var(--header-h,4rem)" }}
      style={{
        background: "rgba(250,248,245,.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--stone)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-16">
        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "-0.02em",
            }}
          >
            EliteMart
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <SearchInput />

          <NavLink to="/" className="nav-link text-sm font-medium">
            Home
          </NavLink>

          {/* Categories */}
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-1 text-sm font-medium transition-colors"
              style={{ color: catOpen ? "var(--accent)" : "var(--ink-mid)" }}
            >
              Categories{" "}
              <HiChevronDown
                className={`text-xs transition-transform ${catOpen ? "rotate-180" : ""}`}
              />
            </button>
            {catOpen && (
              <div className={`${dropdownBase} left-0`}>
                <Link
                  to="/products"
                  onClick={() => setCatOpen(false)}
                  className={dropItem}
                >
                  All Categories
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    onClick={() => setCatOpen(false)}
                    className={dropItem}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {!user ? (
            <>
              <NavLink to="/register" className="nav-link text-sm font-medium">
                Register
              </NavLink>
              <NavLink to="/login" className="btn-primary text-sm py-2 px-4">
                Sign In
              </NavLink>
            </>
          ) : (
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserOpen((o) => !o)}
                className="flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: "var(--ink-mid)" }}
              >
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{
                    background: isAdmin ? "#EDE9FE" : "var(--accent-lt)",
                    color: isAdmin ? "#6D28D9" : "var(--accent)",
                  }}
                >
                  {isAdmin ? "Admin" : "User"}
                </span>
                {user.name}
                <HiChevronDown
                  className={`text-xs transition-transform ${userOpen ? "rotate-180" : ""}`}
                />
              </button>
              {userOpen && (
                <div className={`${dropdownBase} right-0`}>
                  <Link
                    to={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
                    onClick={() => setUserOpen(false)}
                    className={dropItem}
                  >
                    Dashboard
                  </Link>
                  <div
                    className="my-1"
                    style={{ height: 1, background: "var(--stone)" }}
                  />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-red-50"
                    style={{ color: "var(--danger)" }}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          {!isAdmin && (
            <NavLink
              to="/cart"
              className="transition-colors hover:text-[var(--accent)]"
              style={{ color: "var(--ink-mid)" }}
            >
              <Badge
                count={cartCount}
                showZero={false}
                styles={{
                  indicator: {
                    background: "var(--accent)",
                    fontFamily: "var(--font-body)",
                  },
                }}
              >
                <HiShoppingCart className="text-xl" />
              </Badge>
            </NavLink>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-xl p-1 rounded-lg transition-colors"
          style={{ color: "var(--ink-mid)" }}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden px-5 py-4 flex flex-col gap-3 animate-fade-in"
          style={{ borderTop: "1px solid var(--stone)", background: "#fff" }}
        >
          <SearchInput />
          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            Home
          </NavLink>
          <NavLink
            to="/categories"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
          >
            Categories
          </NavLink>
          {!user ? (
            <>
              <NavLink
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="nav-link"
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="nav-link"
              >
                Sign In
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={isAdmin ? "/dashboard/admin" : "/dashboard/user"}
                onClick={() => setMenuOpen(false)}
                className="nav-link"
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="text-left text-sm"
                style={{ color: "var(--danger)" }}
              >
                Sign out
              </button>
            </>
          )}
          {!isAdmin && (
            <NavLink
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="nav-link"
            >
              Cart {cartCount > 0 ? `(${cartCount})` : ""}
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
