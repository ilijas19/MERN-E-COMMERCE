import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  Route,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";
import store from "./redux/store.ts";
import { Provider } from "react-redux";

import Login from "./pages/Auth/Login.tsx";
import Register from "./pages/Auth/Register.tsx";
import Home from "./pages/layout/Home.tsx";

import PrivateRoute from "./components/PrivateRoute.tsx";

import Profile from "./pages/user/Profile.tsx";
import AdminRoute from "./components/AdminRoute.tsx";
import UserList from "./pages/Admin/UserList.tsx";
import CategoryList from "./pages/Admin/CategoryList.tsx";
import ProductList from "./pages/Admin/ProductList.tsx";
import ProductDetails from "./pages/user/ProductDetails.tsx";
import Favorites from "./pages/user/Favorites.tsx";
import Shop from "./pages/user/Shop.tsx";
import Cart from "./pages/user/Cart.tsx";
import Shipping from "./pages/Order/Shipping.tsx";
import Summary from "./pages/Order/Summary.tsx";
import OrderDetails from "./pages/Order/OrderDetails.tsx";
import OrderList from "./pages/Admin/OrderList.tsx";
import MyOrders from "./pages/Order/MyOrders.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route index path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/myOrders" element={<MyOrders />} />
      </Route>

      <Route path="admin" element={<AdminRoute />}>
        <Route path="users" element={<UserList />} />
        <Route path="category" element={<CategoryList />} />
        <Route path="products" element={<ProductList />} />
        <Route path="orders" element={<OrderList />} />
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
);
