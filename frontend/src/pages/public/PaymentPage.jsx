import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
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

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: "15px",
      color: "#1f2937",
      fontFamily: "Inter, sans-serif",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#dc2626" },
  },
};

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
          payment_method: {
            card: elements.getElement(CardNumberElement),
          },
        });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
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
          setError("Order saving failed. Contact support.");
        }
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Card Number
        </label>
        <div className="input-field">
          <CardNumberElement options={ELEMENT_STYLE} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date
          </label>
          <div className="input-field">
            <CardExpiryElement options={ELEMENT_STYLE} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CVC
          </label>
          <div className="input-field">
            <CardCvcElement options={ELEMENT_STYLE} />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
        <strong>Test card:</strong> 4242 4242 4242 4242 — Any future date — Any
        3-digit CVC
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn-primary py-3 text-base mt-1 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${formatPrice(cartTotal)}`
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        🔒 Payments are secured by Stripe
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

    const initPayment = async () => {
      try {
        const { data } = await orderService.createPaymentIntent(cartItems);
        if (data?.success) {
          setClientSecret(data.clientSecret);
        } else {
          setFetchError("Could not initialize payment.");
        }
      } catch (err) {
        setFetchError("Server error. Please try again.");
        console.error(err);
      }
    };
    initPayment();
  }, []);

  return (
    <Layout title="Payment — EShop">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Payment</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Order Details
            </h2>

            <div className="flex flex-col gap-2">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span className="truncate max-w-[180px]">
                    {item.name} × {item.quantity || 1}
                  </span>
                  <span className="font-medium">{formatPrice(item.price)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-semibold text-gray-800">Total</span>
              <span className="font-bold text-primary text-lg">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <p className="text-xs text-gray-500 font-medium mb-1">
                Delivering to:
              </p>
              <p className="text-sm text-gray-700">{deliveryAddress}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Card Details
            </h2>

            {fetchError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
                {fetchError}
              </p>
            )}

            {!clientSecret && !fetchError && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
