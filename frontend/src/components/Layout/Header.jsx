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
import {
  HiShoppingCart,
  HiMenu,
  HiX,
  HiChevronDown,
  HiUserCircle,
  HiViewGrid,
  HiClipboardList,
  HiUser,
  HiLogout,
  HiCog,
} from "react-icons/hi";

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
    setUserOpen(false);
    setMenuOpen(false);
  };

  const dropdown = {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    background: "#fff",
    border: "1px solid var(--stone)",
    borderRadius: 14,
    boxShadow: "var(--shadow-lg)",
    minWidth: 220,
    zIndex: 60,
    overflow: "hidden",
    animation: "fadeIn .15s ease both",
  };

  const menuItem = (onClick, children, danger = false) => (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 16px",
        fontSize: 13,
        fontWeight: 500,
        color: danger ? "var(--danger)" : "var(--ink-mid)",
        background: "none",
        border: "none",
        cursor: "pointer",
        transition: "background .12s, color .12s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = danger ? "#FEF2F2" : "var(--cream)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {children}
    </button>
  );

  const menuLink = (to, icon, label) => (
    <Link
      to={to}
      onClick={() => setUserOpen(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 16px",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--ink-mid)",
        transition: "background .12s, color .12s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--cream)";
        e.currentTarget.style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
        e.currentTarget.style.color = "var(--ink-mid)";
      }}
    >
      {icon}
      {label}
    </Link>
  );

  // Avatar initials circle
  const Avatar = ({ size = 32 }) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: isAdmin ? "#EDE9FE" : "var(--accent-lt)",
        color: isAdmin ? "#6D28D9" : "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.38,
        fontFamily: "var(--font-body)",
        flexShrink: 0,
        border: `2px solid ${isAdmin ? "#DDD6FE" : "#FDDCCA"}`,
      }}
    >
      {user?.name?.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50"
      style={{
        height: "var(--header-h, 4rem)",
        background: "rgba(250,248,245,.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--stone)",
      }}
    >
      <div
        className="max-w-7xl mx-auto px-5"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Brand */}
        <NavLink
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <img
            src="/logo.png"
            alt="EliteMart"
            style={{ width: 36, height: 36, objectFit: "contain" }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "-.02em",
            }}
          >
            EliteMart
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5">
          <SearchInput />

          <NavLink to="/" className="nav-link">
            Home
          </NavLink>

          {/* Categories dropdown */}
          <div style={{ position: "relative" }} ref={catRef}>
            <button
              onClick={() => setCatOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                background: "none",
                border: "none",
                color: catOpen ? "var(--accent)" : "var(--ink-mid)",
                transition: "color .15s",
              }}
            >
              Categories
              <HiChevronDown
                style={{
                  fontSize: 12,
                  transition: "transform .2s",
                  transform: catOpen ? "rotate(180deg)" : "none",
                }}
              />
            </button>
            {catOpen && (
              <div
                style={{ ...dropdown, right: "auto", left: 0, minWidth: 190 }}
              >
                <Link
                  to="/products"
                  onClick={() => setCatOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "9px 16px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "var(--ink)",
                    borderBottom: "1px solid var(--stone)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--cream)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  All Categories
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c._id}
                    to={`/category/${c.slug}`}
                    onClick={() => setCatOpen(false)}
                    style={{
                      display: "block",
                      padding: "8px 16px",
                      fontSize: 13,
                      color: "var(--ink-mid)",
                      transition: "background .12s, color .12s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--cream)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "none";
                      e.currentTarget.style.color = "var(--ink-mid)";
                    }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Guest: Register + Sign In */}
          {!user && (
            <>
              <NavLink to="/register" className="nav-link">
                Register
              </NavLink>
              <NavLink
                to="/login"
                className="btn-primary"
                style={{ padding: "7px 16px", fontSize: 13 }}
              >
                Sign In
              </NavLink>
            </>
          )}

          {/* Logged in: Cart + Account icon */}
          {user && (
            <>
              {/* Cart — users only */}
              {!isAdmin && (
                <NavLink
                  to="/cart"
                  style={{ color: "var(--ink-mid)", position: "relative" }}
                  className="transition-colors hover:text-[var(--accent)]"
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
                    <HiShoppingCart style={{ fontSize: 22 }} />
                  </Badge>
                </NavLink>
              )}

              {/* Account icon + dropdown */}
              <div style={{ position: "relative" }} ref={userRef}>
                <button
                  onClick={() => setUserOpen((o) => !o)}
                  aria-label="Account menu"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    background: userOpen ? "var(--cream-dark)" : "var(--cream)",
                    border: "1.5px solid var(--stone)",
                    borderRadius: 99,
                    padding: "4px 10px 4px 4px",
                    cursor: "pointer",
                    transition: "background .15s, border-color .15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--accent)")
                  }
                  onMouseLeave={(e) =>
                    !userOpen &&
                    (e.currentTarget.style.borderColor = "var(--stone)")
                  }
                >
                  <Avatar size={28} />
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--ink-mid)",
                      maxWidth: 90,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user.name}
                  </span>
                  <HiChevronDown
                    style={{
                      fontSize: 12,
                      color: "var(--ink-faint)",
                      transition: "transform .2s",
                      transform: userOpen ? "rotate(180deg)" : "none",
                    }}
                  />
                </button>

                {userOpen && (
                  <div style={dropdown}>
                    {/* User info header */}
                    <div
                      style={{
                        padding: "12px 16px 10px",
                        borderBottom: "1px solid var(--stone)",
                        background: "var(--cream)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Avatar size={36} />
                        <div style={{ minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "var(--ink)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {user.name}
                          </p>
                          <p
                            style={{
                              fontSize: 11,
                              color: "var(--ink-soft)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {user.email}
                          </p>
                        </div>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 20,
                            background: isAdmin
                              ? "#EDE9FE"
                              : "var(--accent-lt)",
                            color: isAdmin ? "#6D28D9" : "var(--accent)",
                            flexShrink: 0,
                            letterSpacing: ".03em",
                          }}
                        >
                          {isAdmin ? "ADMIN" : "USER"}
                        </span>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "6px 0" }}>
                      {isAdmin ? (
                        // Admin links
                        <>
                          {menuLink(
                            "/dashboard/admin",
                            <HiViewGrid style={{ fontSize: 15 }} />,
                            "Dashboard",
                          )}
                          {menuLink(
                            "/dashboard/admin/orders",
                            <HiClipboardList style={{ fontSize: 15 }} />,
                            "All Orders",
                          )}
                          {menuLink(
                            "/dashboard/admin/products",
                            <HiCog style={{ fontSize: 15 }} />,
                            "Products",
                          )}
                          {menuLink(
                            "/dashboard/admin/create-category",
                            <HiCog style={{ fontSize: 15 }} />,
                            "Categories",
                          )}
                          {menuLink(
                            "/dashboard/admin/users",
                            <HiUser style={{ fontSize: 15 }} />,
                            "Users",
                          )}
                        </>
                      ) : (
                        // User links
                        <>
                          {menuLink(
                            "/dashboard/user",
                            <HiViewGrid style={{ fontSize: 15 }} />,
                            "Dashboard",
                          )}
                          {menuLink(
                            "/dashboard/user/profile",
                            <HiUser style={{ fontSize: 15 }} />,
                            "My Profile",
                          )}
                          {menuLink(
                            "/dashboard/user/orders",
                            <HiClipboardList style={{ fontSize: 15 }} />,
                            "My Orders",
                          )}
                        </>
                      )}
                    </div>

                    {/* Sign out */}
                    <div
                      style={{
                        borderTop: "1px solid var(--stone)",
                        padding: "6px 0",
                      }}
                    >
                      {menuItem(
                        handleLogout,
                        <>
                          <HiLogout style={{ fontSize: 15 }} /> Sign out
                        </>,
                        true,
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="md:hidden flex items-center gap-3">
          {user && !isAdmin && (
            <NavLink to="/cart" style={{ color: "var(--ink-mid)" }}>
              <Badge
                count={cartCount}
                showZero={false}
                styles={{ indicator: { background: "var(--accent)" } }}
              >
                <HiShoppingCart style={{ fontSize: 22 }} />
              </Badge>
            </NavLink>
          )}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              fontSize: 22,
              color: "var(--ink-mid)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
            }}
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--stone)",
            background: "#fff",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
          className="md:hidden animate-fade-in"
        >
          <SearchInput />

          <div
            style={{ height: 1, background: "var(--stone)", margin: "8px 0" }}
          />

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
            style={{ padding: "6px 0" }}
          >
            Home
          </NavLink>
          <NavLink
            to="/categories"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
            style={{ padding: "6px 0" }}
          >
            Categories
          </NavLink>

          {!user ? (
            <>
              <div
                style={{
                  height: 1,
                  background: "var(--stone)",
                  margin: "4px 0",
                }}
              />
              <NavLink
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="nav-link"
                style={{ padding: "6px 0" }}
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
                style={{ marginTop: 4, justifyContent: "center" }}
              >
                Sign In
              </NavLink>
            </>
          ) : (
            <>
              <div
                style={{
                  height: 1,
                  background: "var(--stone)",
                  margin: "4px 0",
                }}
              />

              {/* Mobile user info */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                }}
              >
                <Avatar size={36} />
                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink)",
                    }}
                  >
                    {user.name}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--ink-soft)" }}>
                    {user.email}
                  </p>
                </div>
              </div>

              <div
                style={{
                  height: 1,
                  background: "var(--stone)",
                  margin: "4px 0",
                }}
              />

              {isAdmin ? (
                <>
                  <NavLink
                    to="/dashboard/admin"
                    onClick={() => setMenuOpen(false)}
                    className="nav-link"
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <HiViewGrid /> Dashboard
                  </NavLink>
                  <NavLink
                    to="/dashboard/admin/orders"
                    onClick={() => setMenuOpen(false)}
                    className="nav-link"
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <HiClipboardList /> All Orders
                  </NavLink>
                  <NavLink
                    to="/dashboard/admin/products"
                    onClick={() => setMenuOpen(false)}
                    className="nav-link"
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <HiCog /> Products
                  </NavLink>
                  <NavLink
                    to="/dashboard/admin/users"
                    onClick={() => setMenuOpen(false)}
                    className="nav-link"
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <HiUser /> Users
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/dashboard/user"
                    onClick={() => setMenuOpen(false)}
                    className="nav-link"
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <HiViewGrid /> Dashboard
                  </NavLink>
                  <NavLink
                    to="/dashboard/user/profile"
                    onClick={() => setMenuOpen(false)}
                    className="nav-link"
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <HiUser /> My Profile
                  </NavLink>
                  <NavLink
                    to="/dashboard/user/orders"
                    onClick={() => setMenuOpen(false)}
                    className="nav-link"
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <HiClipboardList /> My Orders
                  </NavLink>
                  <NavLink
                    to="/cart"
                    onClick={() => setMenuOpen(false)}
                    className="nav-link"
                    style={{
                      padding: "6px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <HiShoppingCart /> Cart{" "}
                    {cartCount > 0 ? `(${cartCount})` : ""}
                  </NavLink>
                </>
              )}

              <div
                style={{
                  height: 1,
                  background: "var(--stone)",
                  margin: "4px 0",
                }}
              />
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 0",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--danger)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <HiLogout /> Sign out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Header;
