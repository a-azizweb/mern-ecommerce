import React from 'react';
import './ProductImages.css';

import { useState } from 'react';
const ProductImages = ({ images = [{ url: '' }] }) => {
  // console.log(images.url);
// 

  //DUMMY_IMAGES _ARRAY
  // const images = [
  //   {url:image1},
  //   {url:image2},
  //   {url:image3},
  //   {url:image4}
  
  // ]

  const [mainImage,setMainImage] = useState(images[0].url)
  console.log(mainImage)

 
  return (
    <>
    <div className="imageContainer">
      
      <div className="secondaryImages">
        {images &&
          images.map((current, index) => {

            const setMainImageHandler =()=>{
              setMainImage(current)
            }
            return(
            
            <img
              src={current.url}
              alt="image"
              key={index}
              onClick={setMainImageHandler}
            
            />
          )}
          )}
      </div>
      <div className="mainImage">
        <img src={mainImage.url ? mainImage.url : images[0].url} alt="" />
      </div>


    </div>
    
    
      </>
  );
};

export default ProductImages;
