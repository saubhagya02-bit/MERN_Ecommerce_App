import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    currentOrder: null,
    myOrders: [],
  },
  reducers: {
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    setMyOrders: (state, action) => {
      state.myOrders = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const { setCurrentOrder, setMyOrders, clearCurrentOrder } =
  orderSlice.actions;

export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectMyOrders = (state) => state.order.myOrders;

export default orderSlice.reducer;
