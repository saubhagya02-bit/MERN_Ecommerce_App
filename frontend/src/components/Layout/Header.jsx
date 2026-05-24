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
  HiViewGrid,
  HiClipboardList,
  HiUser,
  HiLogout,
  HiCog,
  HiPhone,
  HiMail,
  HiTag,
} from "react-icons/hi";
import { FaWineBottle } from "react-icons/fa";
import {
  FaLaptop,
  FaTshirt,
  FaShoePrints,
  FaClock,
  FaGem,
  FaBasketballBall,
  FaCouch,
  FaBook,
  FaGamepad,
  FaShoppingBasket,
  FaShoppingCart,
} from "react-icons/fa";
import { MdOutlineDevicesOther } from "react-icons/md";

const CATEGORY_ICONS = {
  electronics: <FaLaptop />,
  tech: <FaLaptop />,
  computers: <MdOutlineDevicesOther />,

  fashion: <FaTshirt />,
  clothing: <FaTshirt />,
  clothes: <FaTshirt />,

  shoes: <FaShoePrints />,
  footwear: <FaShoePrints />,

  accessories: <FaClock />,
  watches: <FaClock />,

  jewellery: <FaGem />,
  jewelry: <FaGem />,

  beauty: <FaGem />,
  cosmetics: <FaGem />,

  sports: <FaBasketballBall />,
  fitness: <FaBasketballBall />,

  home: <FaCouch />,
  furniture: <FaCouch />,

  books: <FaBook />,

  toys: <FaGamepad />,

  grocery: <FaShoppingBasket />,
  food: <FaShoppingBasket />,

  bottles: <FaWineBottle />,
};

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

  const normalize = (str) => str?.toLowerCase().replace(/[^a-z]/g, "");

  useEffect(() => {
    const h = (e) => {
      if (catRef.current && !catRef.current.contains(e.target))
        setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target))
        setUserOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    toast.success("Signed out");
    navigate("/login");
    setUserOpen(false);
    setMenuOpen(false);
  };

  // Avatar circle
  const Avatar = ({ size = 30 }) => (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: isAdmin ? "#EDE9FE" : "var(--accent-lt)",
        color: isAdmin ? "#6D28D9" : "var(--accent)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.38,
        border: `2px solid ${isAdmin ? "#DDD6FE" : "#FDDCCA"}`,
      }}
    >
      {user?.name?.charAt(0).toUpperCase()}
    </div>
  );

  const dropdownShell = {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    background: "#fff",
    border: "1px solid var(--stone)",
    borderRadius: 14,
    boxShadow: "0 12px 40px rgba(28,25,23,.14)",
    zIndex: 60,
    overflow: "hidden",
    animation: "fadeIn .15s ease both",
  };

  const dItem = (to, icon, label, onClick) => (
    <Link
      to={to}
      onClick={onClick ?? (() => setUserOpen(false))}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 16px",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--ink-mid)",
        transition: "background .12s",
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

  return (
    <>
      <div
        style={{
          background: "var(--ink)",
          color: "var(--ink-soft)",
          fontSize: 12,
          padding: "6px 0",
        }}
      >
        <div
          className="max-w-7xl mx-auto px-5"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <HiPhone style={{ fontSize: 13 }} /> +94 12 345 6789
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <HiMail style={{ fontSize: 13 }} /> support@elitemart.com
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                color: "#F59E0B",
              }}
            >
              <HiTag style={{ fontSize: 13 }} /> Free shipping on orders over
              $50
            </span>
          </div>
        </div>
      </div>

      <nav
        className="fixed left-0 w-full z-50"
        style={{
          top: 0,

          background: "rgba(250,248,245,.97)",
          backdropFilter: "blur(14px)",
          borderBottom: "1px solid var(--stone)",
          height: "var(--header-h, 4rem)",
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
          <NavLink
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            <img
              src="/logo.png"
              alt="EliteMart"
              style={{ width: 38, height: 38, objectFit: "contain" }}
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
          <div className="hidden md:flex items-center" style={{ gap: 24 }}>
            {/* Search */}
            <SearchInput />

            <NavLink to="/" className="nav-link" style={{ fontWeight: 500 }}>
              Home
            </NavLink>

            {/* Categories mega dropdown */}
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
                  style={{
                    ...dropdownShell,
                    right: "auto",
                    left: "50%",
                    transform: "translateX(-50%)",
                    minWidth: 480,
                    maxWidth: 560,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      padding: "12px 20px",
                      background: "var(--cream)",
                      borderBottom: "1px solid var(--stone)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        color: "var(--ink-soft)",
                      }}
                    >
                      Shop by Category
                    </span>
                    <Link
                      to="/categories"
                      onClick={() => setCatOpen(false)}
                      style={{
                        fontSize: 12,
                        color: "var(--accent)",
                        fontWeight: 600,
                      }}
                    >
                      View all
                    </Link>
                  </div>

                  {/* Category grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 2,
                      padding: 8,
                    }}
                  >
                    {categories.map((c) => (
                      <Link
                        key={c._id}
                        to={`/category/${c.slug}`}
                        onClick={() => setCatOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "10px 14px",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--ink-mid)",
                          transition: "background .12s",
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
                        <span
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "var(--accent-lt)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 16,
                            flexShrink: 0,
                          }}
                        >
                          {CATEGORY_ICONS[c.slug?.toLowerCase()] ||
                            CATEGORY_ICONS[c.name?.toLowerCase()] ||
                            CATEGORY_ICONS.default}
                        </span>
                        {c.name}
                      </Link>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: "10px 16px",
                      borderTop: "1px solid var(--stone)",
                      background: "var(--cream)",
                      display: "flex",
                      gap: 8,
                    }}
                  >
                    <Link
                      to="/products"
                      onClick={() => setCatOpen(false)}
                      className="btn-primary"
                      style={{
                        flex: 1,
                        fontSize: 12,
                        padding: "7px 0",
                        justifyContent: "center",
                      }}
                    >
                      All Products
                    </Link>
                    <Link
                      to="/categories"
                      onClick={() => setCatOpen(false)}
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        fontSize: 12,
                        padding: "7px 0",
                        justifyContent: "center",
                      }}
                    >
                      All Categories
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/about"
              className="nav-link"
              style={{ fontWeight: 500 }}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className="nav-link"
              style={{ fontWeight: 500 }}
            >
              Contact
            </NavLink>
          </div>

          <div className="hidden md:flex items-center" style={{ gap: 16 }}>
            {/* Guest */}
            {!user && (
              <>
                <NavLink
                  to="/register"
                  className="nav-link"
                  style={{ fontWeight: 500 }}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="btn-primary"
                  style={{ padding: "7px 18px", fontSize: 13 }}
                >
                  Sign In
                </NavLink>
              </>
            )}

            {/* Logged in */}
            {user && (
              <>
                {/* Cart */}
                {!isAdmin && (
                  <NavLink
                    to="/cart"
                    style={{
                      color: "var(--ink-mid)",
                      position: "relative",
                      transition: "color .15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--accent)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--ink-mid)")
                    }
                  >
                    <Badge
                      count={cartCount}
                      showZero={false}
                      styles={{
                        indicator: {
                          background: "var(--accent)",
                          fontFamily: "var(--font-body)",
                          fontSize: 10,
                        },
                      }}
                    >
                      <HiShoppingCart style={{ fontSize: 22 }} />
                    </Badge>
                  </NavLink>
                )}

                <div style={{ position: "relative" }} ref={userRef}>
                  <button
                    onClick={() => setUserOpen((o) => !o)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      background: userOpen
                        ? "var(--cream-dark)"
                        : "var(--cream)",
                      border: "1.5px solid var(--stone)",
                      borderRadius: 99,
                      padding: "4px 10px 4px 5px",
                      cursor: "pointer",
                      transition: "border-color .15s, background .15s",
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
                    <div style={{ ...dropdownShell, minWidth: 230 }}>
                      {/* Header */}
                      <div
                        style={{
                          padding: "12px 16px",
                          background: "var(--cream)",
                          borderBottom: "1px solid var(--stone)",
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
                              flexShrink: 0,
                              letterSpacing: ".03em",
                              background: isAdmin
                                ? "#EDE9FE"
                                : "var(--accent-lt)",
                              color: isAdmin ? "#6D28D9" : "var(--accent)",
                            }}
                          >
                            {isAdmin ? "ADMIN" : "USER"}
                          </span>
                        </div>
                      </div>

                      <div style={{ padding: "6px 0" }}>
                        {isAdmin ? (
                          <>
                            {dItem(
                              "/dashboard/admin",
                              <HiViewGrid style={{ fontSize: 15 }} />,
                              "Dashboard",
                            )}
                            {dItem(
                              "/dashboard/admin/orders",
                              <HiClipboardList style={{ fontSize: 15 }} />,
                              "All Orders",
                            )}
                            {dItem(
                              "/dashboard/admin/products",
                              <HiCog style={{ fontSize: 15 }} />,
                              "Products",
                            )}
                            {dItem(
                              "/dashboard/admin/create-category",
                              <HiCog style={{ fontSize: 15 }} />,
                              "Categories",
                            )}
                            {dItem(
                              "/dashboard/admin/users",
                              <HiUser style={{ fontSize: 15 }} />,
                              "Users",
                            )}
                          </>
                        ) : (
                          <>
                            {dItem(
                              "/dashboard/user",
                              <HiViewGrid style={{ fontSize: 15 }} />,
                              "Dashboard",
                            )}
                            {dItem(
                              "/dashboard/user/profile",
                              <HiUser style={{ fontSize: 15 }} />,
                              "My Profile",
                            )}
                            {dItem(
                              "/dashboard/user/orders",
                              <HiClipboardList style={{ fontSize: 15 }} />,
                              "My Orders",
                            )}
                          </>
                        )}
                      </div>

                      <div
                        style={{
                          borderTop: "1px solid var(--stone)",
                          padding: "6px 0",
                        }}
                      >
                        <button
                          onClick={handleLogout}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            padding: "9px 16px",
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--danger)",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            transition: "background .12s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#FEF2F2")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "none")
                          }
                        >
                          <HiLogout style={{ fontSize: 15 }} /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="md:hidden flex items-center" style={{ gap: 12 }}>
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
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="md:hidden animate-fade-in"
          style={{
            position: "fixed",
            top: "var(--header-h,4rem)",
            left: 0,
            right: 0,
            bottom: 0,
            background: "#fff",
            zIndex: 49,
            overflowY: "auto",
            borderTop: "1px solid var(--stone)",
            padding: "1rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <SearchInput />
          <div
            style={{ height: 1, background: "var(--stone)", margin: "8px 0" }}
          />

          <NavLink
            to="/"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
            style={{ padding: "7px 0" }}
          >
            Home
          </NavLink>
          <NavLink
            to="/categories"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
            style={{ padding: "7px 0" }}
          >
            Categories
          </NavLink>
          <NavLink
            to="/products"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
            style={{ padding: "7px 0" }}
          >
            All Products
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
            style={{ padding: "7px 0" }}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="nav-link"
            style={{ padding: "7px 0" }}
          >
            Contact
          </NavLink>

          <div
            style={{ height: 1, background: "var(--stone)", margin: "4px 0" }}
          />

          {!user ? (
            <>
              <NavLink
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="nav-link"
                style={{ padding: "7px 0" }}
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="btn-primary"
                style={{ marginTop: 4 }}
              >
                Sign In
              </NavLink>
            </>
          ) : (
            <>
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
                      padding: "7px 0",
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
                      padding: "7px 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <HiClipboardList /> Orders
                  </NavLink>
                  <NavLink
                    to="/dashboard/admin/products"
                    onClick={() => setMenuOpen(false)}
                    className="nav-link"
                    style={{
                      padding: "7px 0",
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
                      padding: "7px 0",
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
                      padding: "7px 0",
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
                      padding: "7px 0",
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
                      padding: "7px 0",
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
                      padding: "7px 0",
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
                }}
              >
                <HiLogout /> Sign out
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
