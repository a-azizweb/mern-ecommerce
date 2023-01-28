import { Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { getAdminProduct } from '../../actions/productActions';

import Sidebar from './Sidebar';
import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
const Dashboard = () => {
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  let outOfStock = 0;
  products &&
    products.forEach((item) => {
      if (item.Stock === 0) {
        outOfStock += 1;
      }
    });
  const doughnutState = {
    labels: ['Out of Stock', 'InStock'],
    datasets: [
      {
        backgroundColor: ['#00A6B4', '#6800B4'],
        hoverBackgroundColor: ['#4B5000', '#35014F'],
        data: [outOfStock, products.length - outOfStock],
      },
    ],
  };
  useEffect(() => {
    dispatch(getAdminProduct());
  }, [dispatch]);
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="dashboardContainer">
        <Typography component="h1">Dashboard</Typography>
        <div className="dashboardSummary">
          <div>
            <p>
              Totoal Amount <br /> Rs 500000
            </p>
          </div>

          <div className="dashboardSummaryBox-2">
            <Link to="/admin/products">
              <p>Products</p>
              <p>{products && products.length}</p>
            </Link>

            <Link to="/admin/Orders">
              <p>Orders</p>
              <p>4</p>
            </Link>

            <Link to="/admin/users">
              <p>Users</p>
              <p>2</p>
            </Link>
          </div>
        </div>

        <div className="doughnutChart">
          <Doughnut data={doughnutState} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
