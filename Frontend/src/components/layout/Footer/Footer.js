import React from 'react';
import playStore from '../../../images/playstore.png';
import appStore from '../../../images/appstore.png';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer id={styles.footer}>
      <div className={styles.leftFooter}>
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>

        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className={styles.midFooter}>
        <h1>AzizMart.</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2022 &copy; Aziz</p>
      </div>

      <div className={styles.rightFooter}>
        <h4>Follow Us</h4>
        <a href="/">Instagram</a>
        {/* <a href="/">Youtube</a> */}
        <a href="/">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;
