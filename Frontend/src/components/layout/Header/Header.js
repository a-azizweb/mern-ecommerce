import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { FaBars } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs';
import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import UserOptions from './UserOptions';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';

const Header = () => {
  const navigate = useNavigate();
  const [menuBar, setMenuBar] = useState(false);
  const [searchBar, setSearchBar] = useState(false);
  const [keyword, setKeyword] = useState('');

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);
  const menuHanler = () => {
    setMenuBar(!menuBar);
    setSearchBar(false);
  };

  const searchBarHandler = () => {
    setSearchBar(!searchBar);
    setMenuBar(false);
  };

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    console.log(keyword);
    if (keyword.trim()) {
      navigate(`/products/${keyword}`);
    } else {
      navigate('/products');
    }
  };

  console.log(keyword);
  return (
    <>
      <div className={styles.header}>
        <div>
          <Link className={styles.logo} to={`/`}>
            AzizMart
          </Link>
        </div>
        <div className={styles.links}>
          <Link className={styles.link} to={`/`}>
            Home
          </Link>
          <Link to={`/products`} className={styles.link}>
            Products
          </Link>
          <Link className={styles.link}>Contact</Link>
          <Link className={styles.link}>About</Link>
        </div>

        <div className={styles.icons}>
          <div className={styles.search}>
            <form onSubmit={searchSubmitHandler}>
              <input
                type="text"
                placeholder="Search here"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className={styles.inputSearchIcon} type="submit">
                <BsSearch />
              </button>
            </form>
          </div>
          <div>
            <Link className={styles.searchIcon}>
              <BsSearch onClick={searchBarHandler} />
            </Link>
            <Link className={styles.icon} to="/cart">
              {cartItems.length > 0 && (
                <div
                  className={
                    isAuthenticated ? styles.cartBatch2 : styles.cartBatch
                  }
                >
                  {cartItems.length}
                </div>
              )}
              <ShoppingCartIcon />
            </Link>
            {!isAuthenticated && (
              <Link className={styles.icon} to={`/login`}>
                <FiUser />
              </Link>
            )}

            <Link className={styles.Bars}>
              <FaBars onClick={menuHanler} />
            </Link>

            {isAuthenticated && !menuBar && !searchBar && (
              <UserOptions user={user} />
            )}
          </div>
        </div>
      </div>

      {menuBar && (
        <div className={styles.menuBar}>
          <Link className={styles.menuBarLink} to={`/`}>
            Home
          </Link>
          <Link className={styles.menuBarLink} to={`/products`}>
            Products
          </Link>
          <Link className={styles.menuBarLink}>Contact</Link>
          <Link className={styles.menuBarLink}>About</Link>
        </div>
      )}

      {searchBar && (
        <div className={styles.menuBar}>
          <div className={styles.menuBarsearch}>
            <form onSubmit={searchSubmitHandler}>
              <input
                type="text"
                placeholder="Search here"
                onChange={(e) => setKeyword(e.target.value)}
              />
              <button className={styles.inputSearchIcon}>
                <BsSearch />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
