const catchAsyncErrors = require('../middleware/catchAsyncErrors');

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = {
    client_secret: 'DummySecretKey',
    amount: req.body.amount,
    currency: 'pkr',
    company: 'Ecommerce',
  };

  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
    //stripeApiKey
  });
});
