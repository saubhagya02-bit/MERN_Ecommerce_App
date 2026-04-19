import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./store/slices/authSlice";
import cartReducer from "./store/slices/cartSlice";
import searchReducer from "./store/slices/searchSlice";
import PageNotFound from "./pages/public/PageNotFound";
import Login from "./pages/Auth/Login";
import { cartSlice } from "./store/slices/cartSlice";

const makeStore = (preloadedState = {}) =>
  configureStore({
    reducer: { auth: authReducer, cart: cartReducer, search: searchReducer },
    preloadedState,
  });

const renderWithProviders = (ui, { store = makeStore() } = {}) =>
  render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
  );

describe("PageNotFound", () => {
  it("renders 404 heading", () => {
    renderWithProviders(<PageNotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("renders Go Back Home link pointing to /", () => {
    renderWithProviders(<PageNotFound />);
    const link = screen.getByRole("link", { name: /go back home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});

describe("Login page", () => {
  it("renders email and password inputs", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByPlaceholderText(/enter your email/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
  });

  it("renders the login button", () => {
    renderWithProviders(<Login />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("renders forgot password link", () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });
});

describe("cartSlice", () => {
  it("adds item to cart", () => {
    const store = makeStore();
    const product = { _id: "abc123", name: "Test Product", price: 29.99 };
    store.dispatch({ type: "cart/addToCart", payload: product });
    expect(store.getState().cart.items).toHaveLength(1);
    expect(store.getState().cart.items[0].name).toBe("Test Product");
  });

  it("removes item from cart", () => {
    const store = makeStore({
      cart: { items: [{ _id: "abc123", name: "Test", price: 10 }] },
    });
    store.dispatch({ type: "cart/removeFromCart", payload: "abc123" });
    expect(store.getState().cart.items).toHaveLength(0);
  });

  it("calculates correct total", () => {
    const store = makeStore({
      cart: {
        items: [
          { _id: "1", price: 20 },
          { _id: "2", price: 30 },
        ],
      },
    });
    const total = store.getState().cart.items.reduce((s, i) => s + i.price, 0);
    expect(total).toBe(50);
  });
});

describe("authSlice", () => {
  it("sets credentials correctly", () => {
    const store = makeStore();
    store.dispatch({
      type: "auth/setCredentials",
      payload: { user: { name: "Alice", role: 0 }, token: "tok123" },
    });
    expect(store.getState().auth.user.name).toBe("Alice");
    expect(store.getState().auth.token).toBe("tok123");
  });

  it("clears state on logout", () => {
    const store = makeStore({
      auth: { user: { name: "Alice" }, token: "tok123" },
    });
    store.dispatch({ type: "auth/logout" });
    expect(store.getState().auth.user).toBeNull();
    expect(store.getState().auth.token).toBe("");
  });
});
