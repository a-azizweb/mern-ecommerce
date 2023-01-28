const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Product = require('../models/productModel');

// 3 - create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsprice,
    shippingPrice,
    totalPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsprice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});

// 2 - Get Single Order
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    return next(new ErrorHandler('Order Not Found With This Id', 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// 3 - Getting Orders of a Logged In user
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  //finding in doucument where the id of user (field in Order Model) matches to loggedin user
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// 4 - Get All Orders --admin route

exports.getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// 5 - Update Order Status --admin

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order Not Found', 400));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('You Have Already Delivered This Order', 400));
  }

  order.orderItems.forEach(async (o) => {
    await updateStock(o.product, o.quantity);
  });

  order.orderStatus = req.body.status;

  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//update stock function
async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.Stock = product.Stock - quantity;
  await product.save({ validateBeforeSave: false });
}

// 6 - Delete Order  --admin

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler('Order Not Found', 400));
  }
  await order.remove();

  res.status(200).json({
    success: true,
  });
});
