import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/Layout/Layout";
import productService from "../../api/productService";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
} from "../../store/slices/cartSlice";
import { selectCurrentUser, selectToken } from "../../store/slices/authSlice";
import { formatPrice, truncate } from "../../utils/formatters";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectToken);

  // Remove item — restore full qty back to stock
  const handleRemove = async (item) => {
    const qty = item.quantity || 1;
    dispatch(removeFromCart(item._id));
    try {
      await productService.adjustStock(item._id, +qty); // restore stock
    } catch {
      toast.error("Could not update stock — please refresh");
    }
  };

  // Change quantity
  const handleQtyChange = async (item, delta) => {
    const currentQty = item.quantity || 1;
    // Prevent reducing below 1 without removing
    if (currentQty + delta < 1) return;

    dispatch(updateQuantity({ productId: item._id, delta }));
    try {
      await productService.adjustStock(item._id, -delta);
    } catch (err) {
      // Rollback
      dispatch(updateQuantity({ productId: item._id, delta: -delta }));
      toast.error(err.message || "Could not update quantity");
    }
  };

  return (
    <Layout title="Your Cart — EliteMart">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-.02em",
            }}
          >
            {token ? `${user?.name}'s Cart` : "Your Cart"}
          </h1>
          <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 4 }}>
            {items.length > 0
              ? `${items.length} item${items.length !== 1 ? "s" : ""}`
              : "Your cart is empty"}
          </p>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🛒</p>
            <p
              style={{
                color: "var(--ink-soft)",
                fontSize: 14,
                marginBottom: "1.5rem",
              }}
            >
              Nothing here yet!
            </p>
            <button onClick={() => navigate("/")} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: 24,
            }}
          >
            {/* Cart items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div
                  key={item._id}
                  className="panel"
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    padding: "1rem",
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
                      flexShrink: 0,
                      background: "var(--cream)",
                      borderRadius: 10,
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={productService.getPhotoUrl(item._id)}
                      alt={item.name}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        padding: 6,
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: "var(--ink)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--ink-soft)",
                        marginTop: 2,
                      }}
                    >
                      {truncate(item.description, 55)}
                    </p>

                    {/* Qty controls */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 8,
                      }}
                    >
                      <button
                        onClick={() => handleQtyChange(item, -1)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          border: "1px solid var(--stone)",
                          background: "var(--cream)",
                          fontWeight: 700,
                          fontSize: 16,
                          cursor: "pointer",
                          color: "var(--ink-mid)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--ink)",
                          minWidth: 20,
                          textAlign: "center",
                        }}
                      >
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleQtyChange(item, +1)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          border: "1px solid var(--stone)",
                          background: "var(--cream)",
                          fontWeight: 700,
                          fontSize: 16,
                          cursor: "pointer",
                          color: "var(--ink-mid)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price + remove */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 8,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--accent)",
                      }}
                    >
                      {formatPrice(item.price * (item.quantity || 1))}
                    </p>
                    <button
                      onClick={() => handleRemove(item)}
                      className="btn-danger"
                      style={{ fontSize: 11, padding: "4px 10px" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div>
              <div
                className="panel"
                style={{
                  position: "sticky",
                  top: "calc(var(--header-h,4rem) + 1rem)",
                }}
              >
                <p className="section-header">Order Summary</p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "var(--ink-mid)",
                    marginBottom: 8,
                  }}
                >
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    color: "var(--ink-mid)",
                    marginBottom: 16,
                  }}
                >
                  <span>Shipping</span>
                  <span style={{ color: "var(--success)", fontWeight: 500 }}>
                    Free
                  </span>
                </div>

                <div className="divider" />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 600,
                    marginBottom: 20,
                    color: "var(--ink)",
                  }}
                >
                  <span>Total</span>
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "var(--accent)",
                    }}
                  >
                    {formatPrice(total)}
                  </span>
                </div>

                {!token && (
                  <button
                    onClick={() => navigate("/login", { state: "/cart" })}
                    className="btn-primary w-full"
                    style={{ padding: "12px 0" }}
                  >
                    Login to Checkout
                  </button>
                )}

                {token && !user?.address && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        background: "#FFFBEB",
                        border: "1px solid #FEF3C7",
                        borderRadius: 8,
                        padding: "10px 12px",
                        fontSize: 12,
                        color: "#92400E",
                      }}
                    >
                      ⚠️ Add a delivery address before checking out.
                    </div>
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      className="btn-outline w-full"
                      style={{ padding: "11px 0" }}
                    >
                      Add Address
                    </button>
                  </div>
                )}

                {token && user?.address && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        background: "var(--cream)",
                        border: "1px solid var(--stone)",
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: "var(--ink-soft)",
                          marginBottom: 3,
                          textTransform: "uppercase",
                          letterSpacing: ".05em",
                        }}
                      >
                        Delivering to
                      </p>
                      <p style={{ fontSize: 13, color: "var(--ink-mid)" }}>
                        {user.address}
                      </p>
                      <button
                        onClick={() => navigate("/dashboard/user/profile")}
                        style={{
                          fontSize: 11,
                          color: "var(--accent)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          marginTop: 4,
                        }}
                      >
                        Change address
                      </button>
                    </div>
                    <button
                      onClick={() => navigate("/checkout")}
                      className="btn-primary w-full"
                      style={{ padding: "13px 0", fontSize: 14 }}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
