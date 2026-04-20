import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import productService from "../../api/productService";
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
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
    <Layout title="Your Cart">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            {token ? `Hello, ${user?.name} 👋` : "Your Cart"}
          </h1>
          <p className="text-gray-500 mt-1">
            {items.length > 0
              ? `${items.length} item${items.length > 1 ? "s" : ""} in your cart`
              : "Your cart is empty"}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-gray-500 mb-4">Nothing here yet!</p>
            <button onClick={() => navigate("/")} className="btn-primary">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4"
                >
                  <img
                    src={productService.getPhotoUrl(item._id)}
                    alt={item.name}
                    className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {truncate(item.description, 60)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary">
                        {formatPrice(item.price)}
                      </span>
                      <button
                        onClick={() => dispatch(removeFromCart(item._id))}
                        className="btn-danger text-xs px-3 py-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="md:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-20">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Order Summary
                </h2>

                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>

                <hr className="mb-4" />

                <div className="flex justify-between font-bold text-gray-800 text-base mb-6">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
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
                    <p className="text-sm text-yellow-600 bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2">
                      ⚠️ Please add a delivery address before checkout.
                    </p>
                    <button
                      onClick={() => navigate("/dashboard/user/profile")}
                      className="btn-outline w-full py-3"
                    >
                      Add Delivery Address
                    </button>
                  </div>
                )}

                {token && user?.address && (
                  <div className="flex flex-col gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-sm">
                      <p className="font-medium text-gray-700 mb-1">
                        Deliver to:
                      </p>
                      <p className="text-gray-600">{user.address}</p>
                      <button
                        onClick={() => navigate("/dashboard/user/profile")}
                        className="text-primary text-xs mt-1 hover:underline"
                      >
                        Change address
                      </button>
                    </div>

                    <button
                      onClick={() => navigate("/checkout")}
                      className="btn-primary w-full py-3 text-base"
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
