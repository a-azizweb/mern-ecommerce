import React, { Fragment } from 'react';
import './Products.css';
import { useSelector, useDispatch } from 'react-redux';
import { getAllProducts, clearErrors } from '../../actions/productActions';
import Loader from '../layout/Loader/Loader';
import ProductCard from '../Home/ProductCard';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import { FiFilter } from 'react-icons/fi';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
const categories = ['Pants', 'Shirts', 'Attire'];

const Products = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 10000]);
  const [range, setRange] = useState([0, 10000]);
  const [category, setCategory] = useState('');
  const [ratings, setRatings] = useState(0);

  const [filtersidebar, setFiltersidebar] = useState(false);
  const {
    loading,
    error,
    products,
    productsCount,
    productsPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  const alert = useAlert();
  const params = useParams();
  const keyword = params.keyword;

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const handleRange = (e, newValue) => {
    setRange(newValue);
  };
  const priceHandler = (event) => {
    setPrice(range);
  };
  const sidebarHandler = () => {
    setFiltersidebar(!filtersidebar);
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }

    dispatch(getAllProducts(keyword, currentPage, price, category, ratings));
  }, [dispatch, keyword, currentPage, price, category, ratings, alert, error]);

  let count = filteredProductsCount;

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="PRODUCTS -- ECOMMERCE" />

          <FiFilter className="filterIcon" onClick={sidebarHandler} />

          <h2 className="productsHeading">Products</h2>

          <div className="container">
            {/* filterting Products */}
            <div className="filterBox">
              <Typography>
                Price: {price[0]} to {price[1]}
              </Typography>
              <Slider
                value={price}
                valueLabelDisplay="auto"
                onChangeCommitted={priceHandler}
                onChange={handleRange}
                aria-labelledby="range-slider"
                min={0}
                max={10000}
              />

              <Typography>Categories</Typography>
              <ul className="categoryBox">
                {categories.map((category) => (
                  <li
                    className="category-link"
                    key={category}
                    onClick={() => setCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>

              <fieldset>
                <Typography component={'legend'}>Ratings Above</Typography>
                <Slider
                  value={ratings}
                  onChange={(e, newRatings) => setRatings(newRatings)}
                  aria-labelledby="continous-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                />
              </fieldset>
            </div>

            <div className="products">
              {products &&
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          </div>

          {/* sidebar for filtering Products */}
          <div
            className={
              filtersidebar ? 'filterSidebarOpen' : 'filterSidebarClose'
            }
          >
            <Typography>
              Price: {price[0]} to {price[1]}
            </Typography>
            <Slider
              value={price}
              onChangeCommitted={priceHandler}
              onChange={handleRange}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />

            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category) => (
                <li
                  className="category-link"
                  key={category}
                  onClick={() => setCategory(category)}
                >
                  {category}
                </li>
              ))}
            </ul>

            <fieldset>
              <Typography component={'legend'}>Ratings Above</Typography>
              <Slider
                value={ratings}
                onChange={(e, newRatings) => setRatings(newRatings)}
                aria-labelledby="continous-slider"
                valueLabelDisplay="auto"
                min={0}
                max={5}
              />
            </fieldset>
          </div>

          {/* Pagination */}
          {productsPerPage < count && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={productsPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default Products;
