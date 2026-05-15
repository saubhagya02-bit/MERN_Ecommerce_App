import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import searchReducer from "./slices/searchSlice";
import orderReducer from "./slices/orderSlice";
import themeReducer  from "./slices/themeSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    search: searchReducer,
    order: orderReducer,
    theme:  themeReducer,
  },
});

export default store;