import React, { Fragment } from 'react';
import ImageSlider from '../layout/imaageSlider/ImageSlider';
import { sliderData } from '../../utils/SliderData';
import './Home.css';
import ProductCard from './ProductCard';
import MetaData from '../layout/MetaData';
import { clearErrors, getAllProducts } from '../../actions/productActions';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import Loader from '../layout/Loader/Loader';
import { useAlert } from 'react-alert';
const Home = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { loading, error, products, productsCount } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllProducts());
  }, [dispatch, alert, error,]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={'Ecommerce'} />
          <section className="homeSlide contentWidth">
            <div className="container">
              <ImageSlider images={sliderData} />
            </div>
          </section>
          <h2 className="homeHeading">Featured Products</h2>
          <div className="Container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </>
      )}
    </Fragment>
  );
};

export default Home;
