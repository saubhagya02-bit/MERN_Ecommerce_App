import { createSlice } from "@reduxjs/toolkit";

const getCartKey = (userId) => `cart_${userId}`;

const loadCart = () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");

    if (!auth?.user || auth.user.role === 1) return [];
    const key = getCartKey(auth.user._id);
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

const saveCart = (items, userId) => {
  if (!userId) return;
  localStorage.setItem(getCartKey(userId), JSON.stringify(items));
};

const removeCart = (userId) => {
  if (!userId) return;
  localStorage.removeItem(getCartKey(userId));
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const auth = JSON.parse(localStorage.getItem("auth") || "null");
      const userId = auth?.user?._id;

      if (auth?.user?.role === 1) return;
      state.items.push(action.payload);
      saveCart(state.items, userId);
    },

    removeFromCart: (state, action) => {
      const auth = JSON.parse(localStorage.getItem("auth") || "null");
      const userId = auth?.user?._id;
      const index = state.items.findIndex(
        (item) => item._id === action.payload,
      );
      if (index !== -1) {
        state.items.splice(index, 1);
        saveCart(state.items, userId);
      }
    },

    clearCart: (state) => {
      const auth = JSON.parse(localStorage.getItem("auth") || "null");
      const userId = auth?.user?._id;
      state.items = [];
      removeCart(userId);
    },

    loadUserCart: (state, action) => {
      const { userId, role } = action.payload;
      if (role === 1) {
        state.items = [];
        return;
      }
      try {
        const saved = JSON.parse(
          localStorage.getItem(getCartKey(userId)) || "[]",
        );
        state.items = saved;
      } catch {
        state.items = [];
      }
    },

    resetCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart, loadUserCart, resetCart } =
  cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.length;
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.price, 0);

export default cartSlice.reducer;
