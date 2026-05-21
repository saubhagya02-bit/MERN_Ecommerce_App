import { createSlice } from "@reduxjs/toolkit";

const ADMIN_ROLE = 1;
const getCartKey = (userId) => `cart_${userId}`;

const loadCart = () => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth") || "null");
    if (!auth?.user || auth.user.role === ADMIN_ROLE) return [];
    return JSON.parse(localStorage.getItem(getCartKey(auth.user._id)) || "[]");
  } catch {
    return [];
  }
};

const saveCart = (items, userId) =>
  userId && localStorage.setItem(getCartKey(userId), JSON.stringify(items));
const removeCart = (userId) =>
  userId && localStorage.removeItem(getCartKey(userId));

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: loadCart() },
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;
      const product = payload.product ?? payload;
      const userId = payload.userId ?? null;

      const auth = (() => {
        try {
          return JSON.parse(localStorage.getItem("auth") || "null");
        } catch {
          return null;
        }
      })();
      if (auth?.user?.role === ADMIN_ROLE) return;
      const existing = state.items.find((i) => i._id === product._id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCart(state.items, userId ?? auth?.user?._id);
    },

    removeFromCart: (state, action) => {
      const payload = action.payload;
      const productId =
        typeof payload === "string" ? payload : payload.productId;
      const userId = typeof payload === "string" ? null : payload.userId;

      const idx = state.items.findIndex((i) => i._id === productId);
      if (idx !== -1) {
        state.items.splice(idx, 1);
        const auth = (() => {
          try {
            return JSON.parse(localStorage.getItem("auth") || "null");
          } catch {
            return null;
          }
        })();
        saveCart(state.items, userId ?? auth?.user?._id);
      }
    },

    clearCart: (state, action) => {
      const auth = (() => {
        try {
          return JSON.parse(localStorage.getItem("auth") || "null");
        } catch {
          return null;
        }
      })();
      state.items = [];
      removeCart(action.payload ?? auth?.user?._id);
    },

    loadUserCart: (state, action) => {
      const { userId, role } = action.payload;
      if (role === ADMIN_ROLE) {
        state.items = [];
        return;
      }
      try {
        state.items = JSON.parse(
          localStorage.getItem(getCartKey(userId)) || "[]",
        );
      } catch {
        state.items = [];
      }
    },

    resetCart: (state) => {
      state.items = [];
    },

    // Increment / decrement quantity in cart
    updateQuantity: (state, action) => {
      const { productId, delta } = action.payload;
      const item = state.items.find((i) => i._id === productId);
      if (!item) return;
      item.quantity = Math.max(1, (item.quantity || 1) + delta);
      const auth = (() => {
        try {
          return JSON.parse(localStorage.getItem("auth") || "null");
        } catch {
          return null;
        }
      })();
      saveCart(state.items, auth?.user?._id);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  clearCart,
  loadUserCart,
  resetCart,
  updateQuantity,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((n, i) => n + (i.quantity || 1), 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);

export default cartSlice.reducer;
