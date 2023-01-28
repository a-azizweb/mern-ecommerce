const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeature = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
//fnc for '/product/new' route with POST method ---Admin route
// exports.createProduct = catchAsyncErrors(async (req, res, next) => {
//   let images = [];
//   if (typeof req.body.images === 'string') {
//     images.push(req.body.images);
//   } else {
//     images = req.body.images;
//   }

//   const imagesLinks = [];
//   for (let i = 0; i < images.length; i++) {
//     const result = await cloudinary.v2.uploader.upload(images[i], {
//       folder: 'products',
//     });

//     imagesLinks.push({
//       public_id: result.public_id,
//       url: result.secure_url,
//     });
//   }

//   req.body.images = imagesLinks;
//   req.body.user = req.user.id;

//   //create() method of mongoose API is used to create a single or many documents...
//   //in the collection.here the body of the request is stored in document whose schema...
//   //is defined in the Product model
//   try {
//     const product = await Product.create(req.body);
//     res.status(201).json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     return next(new ErrorHandler('Only Four images can be uploaded', 500));
//   }
// });
// Create Product -- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];

  if (typeof req.body.images === 'string') {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: 'products',
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});
//this fnc is the callback fnc of '/products' route and the method is get
//GET all products
exports.getAllProducts = async (req, res, next) => {
  const productsPerPage = 16;

  const productsCount = await Product.countDocuments();

  //apiFeature object which gets Product model and search for req.query
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;
  let filteredProductsCount = products.length;
  apiFeature.pagination(productsPerPage);

  //here we get the products after the search,filernpagination
  products = await apiFeature.query.clone();

  res.status(200).json({
    success: true,
    products,
    productsCount,
    productsPerPage,
    filteredProductsCount,
  });
};

//GET all products(Admin)
exports.getAdminProducts = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
};

//upading Product using id in the url params
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404));
  } else {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
});

//deleting product using id in the url

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(ErrorHandler('Product Not Found', 404));
  } else {
    await product.remove();

    res.status(200).json({
      success: true,
      message: 'Product Deleted',
    });
  }
});

//getting productDetails
exports.productDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(ErrorHandler('Product Not Found', 404));
  } else {
    res.status(200).json({
      success: true,
      product,
    });
  }
});

//creating New Review or Updating Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  //user review
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  //getting product to be reviewed
  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  //checking if already reviewed
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  //finding average ratings pf product based on reviewes length and its rating
  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  //saving in database
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Getting All reviewes of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler('Product Not Found'), 404);
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Deleting Review

exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
