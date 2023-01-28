import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import './CartItemCard.css';
import { AiOutlineDelete } from 'react-icons/ai';
const CartItemCard = ({ item, deleteCartitem }) => {
  return (
    <Fragment>
      <div className="cartItemCard">
        <img src={item.image} alt="productimage" />
        <div>
          <Link to={`/product/${item.product}`}>{item.name}</Link>
          <span>{`Price: RS ${item.price}`}</span>
        
            <AiOutlineDelete onClick={() => deleteCartitem(item.product)} />
          
        </div>
      </div>
    </Fragment>
  );
};

export default CartItemCard;
