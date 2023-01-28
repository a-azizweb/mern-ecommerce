import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/layout/Header/Header';
import Footer from './components/layout/Footer/Footer';
import WebFont from 'webfontloader';
import Home from './components/Home/Home';
import ProductDetails from './components/product/ProductDetails';
import Products from './components/product/Products';
import LoginSignup from './components/layout/User/LoginSignup';

import { loadUser } from './actions/userAction';

import store from './Store';
import UserProfile from './components/layout/User/UserProfile';

import ProtectedRoutes from './components/Route/ProtectedRoutes';
import UpdateProfile from './components/layout/User/UpdateProfile';
import UpdatePassword from './components/layout/User/UpdatePassword';
import ForgotUserPassword from './components/layout/User/ForgotUserPassword';
import ResetPassword from './components/layout/User/ResetPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
import MyOrders from './components/cart/MyOrders';
import OrderDetails from './components/cart/OrderDetails';
import Dashboard from './components/admin/Dashboard';
import { useSelector } from 'react-redux';
import ProductList from './components/admin/ProductList';
import NewProduct from './components/admin/NewProduct';

const App = () => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka'],
      },
    });

    store.dispatch(loadUser());
  }, []);

  return (
    <>
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/product/:id" exact element={<ProductDetails />} />
          <Route path="/products" exact element={<Products />} />
          <Route path="/products/:keyword" element={<Products />} />
          <Route path="/login" exact element={<LoginSignup />} />
          <Route
            path="/password/forgot"
            exact
            element={<ForgotUserPassword />}
          />

          <Route
            path="/password/reset/:token"
            exact
            element={<ResetPassword />}
          />
          <Route path="/cart" exact element={<Cart />} />
          {/* Protected Route */}
          <Route
            element={
              <ProtectedRoutes
                isAuthenticated={isAuthenticated}
                loading={loading}
                isAdmin={true}
                user
              />
            }
          >
            <Route path="/account" exact element={<UserProfile />} />
            <Route path="/me/update" exact element={<UpdateProfile />} />
            <Route path="/password/update" exact element={<UpdatePassword />} />
            <Route path="/shipping" exact element={<Shipping />} />
            <Route path="/process/payment" exact element={<Payment />} />
            <Route path="/success" exact element={<OrderSuccess />} />
            <Route path="/orders" exact element={<MyOrders />} />

            <Route path="/order/confirm" exact element={<ConfirmOrder />} />
            <Route path="/order/:id" exact element={<OrderDetails />} />
            <Route path="/admin/dashboard" exact element={<Dashboard />} />
            <Route path="/admin/products" exact element={<ProductList />} />
            <Route path="/admin/product" exact element={<NewProduct />} />
          </Route>
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
};

export default App;
