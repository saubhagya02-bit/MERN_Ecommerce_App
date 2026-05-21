import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

  return (
    <Layout title="Your Cart — EliteMart">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Page header */}
        <div className="mb-8">
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
          <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
            {items.length > 0
              ? `${items.length} item${items.length !== 1 ? "s" : ""}`
              : "Your cart is empty"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🛒</p>
            <p className="mb-5 text-sm" style={{ color: "var(--ink-soft)" }}>
              Nothing here yet!
            </p>
            <button onClick={() => navigate("/")} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="md:col-span-2 flex flex-col gap-3">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="panel flex gap-4 items-start"
                  style={{ padding: "1rem" }}
                >
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

                  <div className="flex-1 flex flex-col gap-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--ink)" }}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      {truncate(item.description, 55)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({ productId: item._id, delta: -1 }),
                          )
                        }
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          border: "1px solid var(--stone)",
                          background: "var(--cream)",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          color: "var(--ink-mid)",
                        }}
                      >
                        −
                      </button>
                      <span
                        className="text-sm font-medium"
                        style={{
                          minWidth: 20,
                          textAlign: "center",
                          color: "var(--ink)",
                        }}
                      >
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({ productId: item._id, delta: 1 }),
                          )
                        }
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          border: "1px solid var(--stone)",
                          background: "var(--cream)",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          color: "var(--ink-mid)",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "var(--accent)",
                      }}
                    >
                      {formatPrice(item.price * (item.quantity || 1))}
                    </p>
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
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
            <div className="md:col-span-1">
              <div
                className="panel"
                style={{ position: "sticky", top: "5rem" }}
              >
                <p className="section-header" style={{ marginBottom: "1rem" }}>
                  Order Summary
                </p>

                <div
                  className="flex justify-between text-sm mb-2"
                  style={{ color: "var(--ink-mid)" }}
                >
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div
                  className="flex justify-between text-sm mb-4"
                  style={{ color: "var(--ink-mid)" }}
                >
                  <span>Shipping</span>
                  <span style={{ color: "var(--success)", fontWeight: 500 }}>
                    Free
                  </span>
                </div>

                <div className="divider" />

                <div
                  className="flex justify-between font-semibold mb-5"
                  style={{ color: "var(--ink)" }}
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
                    className="btn-primary w-full py-3"
                  >
                    Login to Checkout
                  </button>
                )}

                {token && !user?.address && (
                  <div className="flex flex-col gap-3">
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
                      ⚠️ Add a delivery address to your profile before checking
                      out.
                    </div>
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      className="btn-outline w-full py-3"
                    >
                      Add Address
                    </button>
                  </div>
                )}

                {token && user?.address && (
                  <div className="flex flex-col gap-3">
                    <div
                      style={{
                        background: "var(--cream)",
                        border: "1px solid var(--stone)",
                        borderRadius: 10,
                        padding: "10px 12px",
                      }}
                    >
                      <p
                        className="text-xs font-semibold mb-1"
                        style={{ color: "var(--ink-soft)" }}
                      >
                        Delivering to
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: "var(--ink-mid)" }}
                      >
                        {user.address}
                      </p>
                      <button
                        onClick={() => navigate("/dashboard/user/profile")}
                        className="text-xs mt-1 hover:underline"
                        style={{
                          color: "var(--accent)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                        }}
                      >
                        Change address
                      </button>
                    </div>
                    <button
                      onClick={() => navigate("/checkout")}
                      className="btn-primary w-full py-3"
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
