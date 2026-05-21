import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { HiArrowLeft, HiLockClosed } from "react-icons/hi";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Layout from "../../components/Layout/Layout";
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from "../../store/slices/cartSlice";
import { setCurrentOrder } from "../../store/slices/orderSlice";
import orderService from "../../api/orderService";
import { formatPrice } from "../../utils/formatters";
import productService from "../../api/productService";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: "14px",
      color: "var(--ink)",
      fontFamily: "'DM Sans', sans-serif",
      "::placeholder": { color: "var(--ink-faint)" },
    },
    invalid: { color: "var(--danger)" },
  },
};

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

//  Payment form
const PaymentForm = ({ clientSecret, deliveryAddress }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    setError("");

    try {
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: elements.getElement(CardNumberElement) },
        });

      if (stripeError) {
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        const { data } = await orderService.createOrder(
          cartItems,
          deliveryAddress,
          paymentIntent.id,
        );
        if (data?.success) {
          dispatch(setCurrentOrder(data.order));
          dispatch(clearCart());
          navigate("/order-success");
        } else {
          setError("Order saving failed. Please contact support.");
        }
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputBox = {
    background: "#fff",
    border: "1.5px solid var(--stone)",
    borderRadius: 8,
    padding: "10px 14px",
    transition: "border-color .2s",
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <div>
        <label className="form-label">Card Number</label>
        <div style={inputBox}>
          <CardNumberElement options={ELEMENT_STYLE} />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <label className="form-label">Expiry Date</label>
          <div style={inputBox}>
            <CardExpiryElement options={ELEMENT_STYLE} />
          </div>
        </div>
        <div>
          <label className="form-label">CVC</label>
          <div style={inputBox}>
            <CardCvcElement options={ELEMENT_STYLE} />
          </div>
        </div>
      </div>

      {/* Test card hint */}
      <div
        style={{
          background: "#EFF6FF",
          border: "1px solid #DBEAFE",
          borderRadius: 8,
          padding: "10px 12px",
          fontSize: 12,
          color: "#1D4ED8",
        }}
      >
        <strong>Test card:</strong> 4242 4242 4242 4242 — any future date — any
        3-digit CVC
      </div>

      {error && (
        <div
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 12,
            color: "var(--danger)",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary"
        style={{
          padding: "13px 0",
          fontSize: 15,
          marginTop: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading ? (
          <>
            <span
              style={{
                width: 16,
                height: 16,
                border: "2px solid rgba(255,255,255,.4)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin .7s linear infinite",
                display: "inline-block",
              }}
            />
            Processing…
          </>
        ) : (
          `Pay ${formatPrice(cartTotal)}`
        )}
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
        <HiLockClosed /> Payments are secured by Stripe
      </p>
    </form>
  );
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [clientSecret, setClientSecret] = useState("");
  const [fetchError, setFetchError] = useState("");

  const deliveryAddress = location.state?.address;

  useEffect(() => {
    if (!deliveryAddress) {
      navigate("/checkout");
      return;
    }
    if (cartItems.length === 0) {
      navigate("/cart");
      return;
    }

    orderService
      .createPaymentIntent(cartItems)
      .then(({ data }) => {
        if (data?.success) setClientSecret(data.clientSecret);
        else setFetchError("Could not initialise payment. Please try again.");
      })
      .catch(() => setFetchError("Server error. Please try again."));
  }, []);

  return (
    <Layout title="Payment — EliteMart">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={() => navigate("/checkout")}
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
            <HiArrowLeft /> Back to Checkout
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
            Payment
          </h1>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <Step n={1} label="Cart" done />
          <Divider />
          <Step n={2} label="Checkout" done />
          <Divider />
          <Step n={3} label="Payment" active />
          <Divider />
          <Step n={4} label="Done" />
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
        >
          {/* Order details */}
          <div className="panel">
            <p className="section-header">Order Details</p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                marginBottom: 14,
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "var(--cream)",
                      borderRadius: 7,
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
                        padding: 3,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: "var(--ink-mid)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.name} × {item.quantity || 1}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--ink)",
                      flexShrink: 0,
                    }}
                  >
                    {formatPrice(item.price * (item.quantity || 1))}
                  </span>
                </div>
              ))}
            </div>
            <div className="divider" />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 14,
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
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--accent)",
                }}
              >
                {formatPrice(cartTotal)}
              </span>
            </div>
            <div
              style={{
                background: "var(--cream)",
                borderRadius: 10,
                padding: "10px 12px",
              }}
            >
              <p className="label-xs" style={{ marginBottom: 4 }}>
                Delivering to
              </p>
              <p style={{ fontSize: 13, color: "var(--ink-mid)" }}>
                {deliveryAddress}
              </p>
            </div>
          </div>

          {/* Card details */}
          <div className="panel">
            <p className="section-header">Card Details</p>

            {fetchError && (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  borderRadius: 8,
                  padding: "10px 12px",
                  fontSize: 12,
                  color: "var(--danger)",
                  marginBottom: 16,
                }}
              >
                {fetchError}
              </div>
            )}

            {!clientSecret && !fetchError && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "3rem 0",
                }}
              >
                <div className="spinner" />
              </div>
            )}

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm
                  clientSecret={clientSecret}
                  deliveryAddress={deliveryAddress}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentPage;
