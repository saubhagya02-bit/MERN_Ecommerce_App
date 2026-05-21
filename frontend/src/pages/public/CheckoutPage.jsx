import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import { selectCartItems, selectCartTotal } from "../../store/slices/cartSlice";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { formatPrice } from "../../utils/formatters";
import productService from "../../api/productService";
import { HiArrowLeft, HiLockClosed } from "react-icons/hi";

const Step = ({ n, label, active, done }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 11,
        fontWeight: 700,
        background: done
          ? "var(--success)"
          : active
            ? "var(--accent)"
            : "var(--stone)",
        color: done || active ? "#fff" : "var(--ink-soft)",
      }}
    >
      {done ? "✓" : n}
    </span>
    <span
      style={{
        fontSize: 12,
        fontWeight: active ? 600 : 400,
        color: active
          ? "var(--accent)"
          : done
            ? "var(--ink-mid)"
            : "var(--ink-faint)",
      }}
    >
      {label}
    </span>
  </span>
);

const Divider = () => (
  <span
    style={{ flex: 1, height: 1, background: "var(--stone)", margin: "0 4px" }}
  />
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const user = useSelector(selectCurrentUser);
  const [address, setAddress] = useState(user?.address || "");

  const handleProceed = () => {
    if (!address.trim()) {
      setAddressError("Please enter a delivery address.");
      return;
    }
    navigate("/payment", { state: { address } });
  };

  const [addressError, setAddressError] = useState("");

  if (cartItems.length === 0)
    return (
      <Layout title="Checkout — EliteMart">
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <p style={{ color: "var(--ink-soft)" }}>Your cart is empty.</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </Layout>
    );

  return (
    <Layout title="Checkout — EliteMart">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Back + title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={() => navigate("/cart")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "var(--ink-soft)",
              background: "#fff",
              border: "1px solid var(--stone)",
              borderRadius: 8,
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            <HiArrowLeft /> Back to Cart
          </button>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--ink)",
              letterSpacing: "-.02em",
            }}
          >
            Checkout
          </h1>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <Step n={1} label="Cart" done />
          <Divider />
          <Step n={2} label="Checkout" active />
          <Divider />
          <Step n={3} label="Payment" />
          <Divider />
          <Step n={4} label="Done" />
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          {/* Order summary */}
          <div className="panel">
            <p className="section-header">
              Order Summary ({cartItems.length} item
              {cartItems.length !== 1 ? "s" : ""})
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                marginBottom: 16,
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      background: "var(--cream)",
                      borderRadius: 8,
                      overflow: "hidden",
                      flexShrink: 0,
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
                        padding: 4,
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--ink)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink)",
                      flexShrink: 0,
                    }}
                  >
                    {formatPrice(item.price * (item.quantity || 1))}
                  </p>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--ink-mid)",
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                {formatPrice(cartTotal)}
              </span>
            </div>
          </div>

          {/* Delivery */}
          <div
            className="panel"
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <p className="section-header">Delivery Details</p>

            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={user?.name || ""}
                readOnly
                className="input-field"
                style={{
                  background: "var(--cream)",
                  cursor: "not-allowed",
                  color: "var(--ink-soft)",
                }}
              />
            </div>

            <div>
              <label className="form-label">Phone</label>
              <input
                type="text"
                value={user?.phone || ""}
                readOnly
                className="input-field"
                style={{
                  background: "var(--cream)",
                  cursor: "not-allowed",
                  color: "var(--ink-soft)",
                }}
              />
            </div>

            <div>
              <label className="form-label">
                Delivery Address{" "}
                <span style={{ color: "var(--danger)" }}>*</span>
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  setAddressError("");
                }}
                placeholder="Enter your full delivery address"
                className="input-field"
                style={{ resize: "none" }}
              />
              {addressError && (
                <p
                  style={{ fontSize: 12, color: "var(--danger)", marginTop: 4 }}
                >
                  {addressError}
                </p>
              )}
            </div>

            <button
              onClick={handleProceed}
              className="btn-primary"
              style={{ padding: "12px 0", fontSize: 14, marginTop: 4 }}
            >
              Proceed to Payment
            </button>

            <p
              style={{
                fontSize: 11,
                color: "var(--ink-faint)",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <HiLockClosed /> Your information is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
