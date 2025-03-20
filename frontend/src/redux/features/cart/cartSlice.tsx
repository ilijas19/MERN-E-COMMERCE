import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { CartProduct } from "../../../types";

type ShippingAddress = {
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
};

type CartStateType = {
  cartItems: CartProduct[];
  itemsPrice: number;
  shippingAddress: ShippingAddress;
};

const cartFromStorage = localStorage.getItem("cart1971");
const parsedCart = cartFromStorage ? JSON.parse(cartFromStorage) : null;

const initialState: CartStateType = parsedCart || {
  cartItems: [],
  itemsPrice: 0,
  shippingAddress: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((i) => i._id === item._id);
      if (existingItem) {
        state.cartItems = state.cartItems.map((i) =>
          i._id === existingItem._id ? item : i
        );
      } else {
        state.cartItems.push(item);
      }
      state.itemsPrice = Number(
        state.cartItems
          .reduce((acc, cur) => acc + cur.price * cur.qty, 0)
          .toFixed(2)
      );
      localStorage.setItem("cart1971", JSON.stringify(state));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      state.itemsPrice = Number(
        state.cartItems
          .reduce((acc, cur) => acc + cur.price * cur.qty, 0)
          .toFixed(2)
      );
      localStorage.setItem("cart1971", JSON.stringify(state));
    },
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart1971", JSON.stringify(state));
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      localStorage.setItem("cart1971", JSON.stringify(state));
    },
  },
});
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  clearCartItems,
} = cartSlice.actions;
export default cartSlice.reducer;
