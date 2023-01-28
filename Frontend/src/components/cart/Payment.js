import React, { Fragment, useEffect, useRef } from 'react';
import CheckoutSteps from './CheckoutSteps';
import { useSelector, useDispatch } from 'react-redux';
import MetaData from '../layout/MetaData';
import { Typography } from '@material-ui/core';
import { useAlert } from 'react-alert';
import CreditCardIcon from '@material-ui/icons/CreditCard';
import EventIcon from '@material-ui/icons/Event';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { createOrder, clearErrors } from '../../actions/orderAction';
import './Payment.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const Payment = () => {
  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
  const payBtn = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.newOrder);

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100),
  };
  //making Order data
  const order = {
    shippingInfo,
    orderItems: cartItems,
    itemsPrice: orderInfo.subtotal,
    shippingPrice: orderInfo.shippingCharges,
    totalPrice: orderInfo.totalPrice,
    paymentInfo: {
      id: 'sample paymentInfo',
      status: 'succeeded',
    },
  };
  //Submittinng payment
  const submitHandler = async (e) => {
    e.preventDefault();
    payBtn.current.disabled = true;

    try {
      const config = {
        headers: {
          'content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/v1/payment/process',
        paymentData,
        config
      );
      //creating order
      dispatch(createOrder(order));

      navigate('/success');
      alert.success('payment successful');
    } catch (error) {
      payBtn.current.disabled = false;
      alert.error(error.response.data.message);
    }
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, alert]);
  return (
    <Fragment>
      <MetaData title="Payment" />
      <CheckoutSteps activeStep={2} />

      <div className="paymentContainer">
        <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
          <Typography>Card Info</Typography>
          <div>
            <CreditCardIcon />
            <input
              type="number"
              className="paymentInput"
              placeholder="Card Number"
              required
            />
          </div>
          <div>
            <EventIcon />
            <input type="date" className="paymentInput" />
          </div>
          <div>
            <VpnKeyIcon />
            <input
              type="number"
              className="paymentInput"
              placeholder="Security Code"
              required
            />
          </div>

          <input
            type="submit"
            value={`Pay - RS${orderInfo && orderInfo.totalPrice}`}
            ref={payBtn}
            className="paymentFormBtn"
            required
          />
        </form>
      </div>
    </Fragment>
  );
};

export default Payment;
