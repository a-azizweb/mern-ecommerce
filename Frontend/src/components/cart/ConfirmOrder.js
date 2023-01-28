import React, { Fragment } from 'react';
import './ConfirmOrder.css';
import CheckoutSteps from './CheckoutSteps';
import MetaData from '../layout/MetaData';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from '@material-ui/core';
const ConfirmOrder = () => {
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  //managing shipping
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;

  const totalPrice = subtotal + shippingCharges;

  const address = `${shippingInfo.address},${shippingInfo.city},${shippingInfo.pinCode}`;

  const proceedToPaymentHandler = () => {
    const data = { subtotal, shippingCharges, totalPrice, address };

    sessionStorage.setItem('orderInfo', JSON.stringify(data));
    navigate('/process/payment');
  };

  return (
    <Fragment>
      <MetaData title={'Confirm Order'} />
      <CheckoutSteps activeStep={1} />

      <div className="confirmOrderPage">
        <div>
          <div className="confirmShippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmShippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user.name}</span>
              </div>

              <div>
                <p>Phone:</p>
                <span>{shippingInfo.phoneNo}</span>
              </div>

              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>

          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems &&
                cartItems.map((item) => (
                  <div key={item.product}>
                    <img src={item.image} alt="Product" />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>

                    <span>
                      {item.quantity} X Rs{item.price} ={' '}
                      <b>Rs {item.price * item.quantity}</b>
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* second Div */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>RS{subtotal}</span>
              </div>

              <div>
                <p>Shipping Charges:</p>
                <span>RS{shippingCharges}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>

              <span>RS{totalPrice}</span>
            </div>
            <button onClick={proceedToPaymentHandler}>
              Proceed To Payment
            </button>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
