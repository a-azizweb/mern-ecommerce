import React from 'react';
import { Link } from 'react-router-dom';
import { Rating } from '@material-ui/lab';

const Product = ({ product }) => {
  // const options = {
  //   edit: false,
  //   color: 'rgba(20,20,20,0.1)',
  //   activeColor: '#FF9529',
  //   value: product.ratings,
  //   isHalf: true,
  //   size: window.innerWidth < 600 ? 20 : 25,
  // };

  const options = {
    value: product.ratings,

    readOnly: true,
    precision: 0.5,
  };
  return (
    <>
      <Link className="productCard" to={`/product/${product._id}`}>
        <img src={product.images[0].url} alt={product.name} />
        <p>{product.name}</p>
        <div>
          <Rating {...options} className="stars" />
          <span className="productCardSpan">
            ({Number(product.numOfReviews)}) Reviews
          </span>
        </div>
        <span className="price">{`RS: ${product.price}`}</span>
      </Link>
    </>
  );
};

export default Product;
