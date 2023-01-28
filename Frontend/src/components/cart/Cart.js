import React, { Fragment } from 'react';
import './Cart.css';
import CartItemCard from './CartItemCard';
import { useSelector, useDispatch } from 'react-redux';
import { addItemToCart, removeCartItem } from '../../actions/cartActions';
import { Typography } from '@material-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import MetaData from '../layout/MetaData';
import Loader from '../layout/Loader/Loader';

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { loading } = useSelector((state) => state.productDetails);
  const { isAuthenticated } = useSelector((state) => state.user);
  const navigate = useNavigate();
  //increasing and decreaseing quantity
  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    }
    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (quantity <= 1) {
      return;
    }
    dispatch(addItemToCart(id, newQty));
  };

  const deleteCartItem = (id) => {
    dispatch(removeCartItem(id));
  };

  //checkout
  const checkOuthandler = () => {
    if (isAuthenticated) {
      navigate('/shipping');
    } else {
      navigate('/login');
    }
    // navigate('/login?redirect=/shipping');
  };
  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {cartItems.length === 0 ? (
            <div className="emptyCart">
              <RemoveShoppingCartIcon />
              <Typography>No Product In Your Cart</Typography>
              <Link to={`/products`}>View Products</Link>
            </div>
          ) : (
            <Fragment>
              <MetaData title={'Shopping Cart'} />
              <div className="cartPage">
                <div className="cartHeader">
                  <p>Product</p>
                  <p>Quantity</p>
                  <p>Subtotal</p>
                </div>

                {cartItems &&
                  cartItems.map((item) => (
                    <div className="cartContainer" key={item.product}>
                      <CartItemCard
                        item={item}
                        deleteCartitem={deleteCartItem}
                      />

                      <div className="cartInput">
                        <button
                          onClick={() =>
                            decreaseQuantity(item.product, item.quantity)
                          }
                        >
                          -
                        </button>
                        <input type="number" readOnly value={item.quantity} />
                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.product,
                              item.quantity,
                              item.stock
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className="cartSubtotal">
                        RS {item.price * item.quantity}
                      </p>
                    </div>
                  ))}

                <div className="cartGrossTotal">
                  <div></div>
                  <div className="checkOutContent">
                    <div className="cartGrossProfitBox">
                      <p>Gross Total</p>
                      <p>{`Rs ${cartItems.reduce(
                        (acc, item) => acc + item.quantity * item.price,
                        0
                      )}`}</p>
                    </div>

                    <div className="checkOutbtn">
                      <button onClick={checkOuthandler}>Check Out</button>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Cart;
