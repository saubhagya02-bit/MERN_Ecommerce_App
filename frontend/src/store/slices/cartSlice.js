import { createSlice } from "@reduxjs/toolkit";

const ADMIN_ROLE = 1;
const getCartKey = (userId) => `cart_${userId}`;

const getSavedUser = () => {
  try {
    const u = localStorage.getItem("authUser");
    if (u) return JSON.parse(u);

    const a = localStorage.getItem("auth");
    if (a) return JSON.parse(a)?.user || null;
    return null;
  } catch {
    return null;
  }
};

const loadCart = () => {
  try {
    const user = getSavedUser();
    if (!user || user.role === ADMIN_ROLE) return [];
    return JSON.parse(localStorage.getItem(getCartKey(user._id)) || "[]");
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
  initialState: { items: loadCart() },
  reducers: {
    addToCart: (state, action) => {
      const payload = action.payload;
      const product = payload.product ?? payload;
      const user = getSavedUser();

      if (user?.role === ADMIN_ROLE) return;

      const existing = state.items.find((i) => i._id === product._id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCart(state.items, user?._id);
    },

    removeFromCart: (state, action) => {
      const payload = action.payload;
      const productId =
        typeof payload === "string" ? payload : payload.productId;

      const idx = state.items.findIndex((i) => i._id === productId);
      if (idx !== -1) {
        state.items.splice(idx, 1);
        const user = getSavedUser();
        saveCart(state.items, user?._id);
      }
    },

    clearCart: (state) => {
      const user = getSavedUser();
      state.items = [];
      removeCart(user?._id);
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

    updateQuantity: (state, action) => {
      const { productId, delta } = action.payload;
      const item = state.items.find((i) => i._id === productId);
      if (!item) return;
      item.quantity = Math.max(1, (item.quantity || 1) + delta);
      const user = getSavedUser();
      saveCart(state.items, user?._id);
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
