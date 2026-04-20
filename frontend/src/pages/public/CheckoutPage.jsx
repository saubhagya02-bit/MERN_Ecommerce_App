import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "../../components/Layout/Layout";
import { selectCartItems, selectCartTotal } from "../../store/slices/cartSlice";
import { selectCurrentUser } from "../../store/slices/authSlice";
import { formatPrice } from "../../utils/formatters";
import productService from "../../api/productService";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const user = useSelector(selectCurrentUser);

  const [address, setAddress] = useState(user?.address || "");

  const handleProceed = () => {
    if (!address.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    navigate("/payment", { state: { address } });
  };

  if (cartItems.length === 0) {
    return (
      <Layout title="Checkout">
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500 text-lg">Your cart is empty.</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Checkout — EShop">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary ({cartItems.length} items)
            </h2>

            <div className="flex flex-col gap-4 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <img
                    src={productService.getPhotoUrl(item._id)}
                    alt={item.name}
                    className="w-14 h-14 object-contain rounded-lg bg-gray-50 border border-gray-100"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity || 1}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatPrice(item.price)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
              <span className="text-gray-600 font-medium">Total</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(cartTotal)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-gray-800">
              Delivery Address
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={user?.name || ""}
                readOnly
                className="input-field bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={user?.phone || ""}
                readOnly
                className="input-field bg-gray-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address"
                className="input-field resize-none"
              />
            </div>

            <button
              onClick={handleProceed}
              className="btn-primary py-3 text-base mt-2"
            >
              Proceed to Payment
            </button>

            <p className="text-xs text-gray-400 text-center">
              🔒 Your information is secure and encrypted
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
