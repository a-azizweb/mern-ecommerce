const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const fs = require('fs');

const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

// 1 - Register a User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: 'scale',
  });
  
  const { name, email, password } = req.body;

  //creating user collection in database
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  //getting token from userShema methods and sending it to jwtToken

  sendToken(user, 201, res);
});

// 2 - '/login' Route
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler('Please Enter Email & Password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }
  //getting the token from user schema method

  sendToken(user, 200, res);
});

// 3 - Logout User

exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: 'Logged Out Successfully',
  });
});

// 4 - forgot Password

exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User Not Found', 404));
  }

  //Get resetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //generating link for email

  // const resetPasswordUrl = `${req.protocol}://${req.get(
  //   'host'
  // )}/api/v1/password/reset/${resetToken}`;

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your tempt Password reset Token is :- \n\n ${resetPasswordUrl}
  if You have not requested this email then please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// 5 - Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        'Reset Password Token is invalid OR token has been expired',
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not matched', 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// 6 - Get User Details
// exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.user._id);

//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// 6 - Get User Details

exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id: ${req.body.params}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// 7 - Change Password

exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old Password is Incorrect', 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler('Password does not matched', 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 200, res);
});

// 8 - Updating User Profile

exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId, function (error, result) {
      console.log(error, result);
    });

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 400,
      height: 400,
      crop: 'scale',
    });
    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
//   const newUserData = {
//     name: req.body.name,
//     email: req.body.email,
//   };

//   if (req.body.avatar !== '') {
//     const user = await User.findById(req.user.id);

//     const imageId = user.avatar.public_id;

//     await cloudinary.v2.uploader.destroy(imageId);

//     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
//       folder: 'avatars',
//       width: 150,
//       crop: 'scale',
//     });

//     newUserData.avatar = {
//       public_id: myCloud.public_id,
//       url: myCloud.secure_url,
//     };
//   }

//   // const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//   //   new: true,
//   //   runValidators: true,
//   //   useFindAndModify: false,
//   // });

//   // res.status(200).json({
//   //   success: true,
//   //   user,
//   // });
// });

// 9 - Get All Users

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// 11 - Updating Role of User

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  //we will add cloudnary later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });
  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    message: 'Profile Updated Successfully',
  });
});

// 12 - Deleting User

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id ${req.params.id}`, 400)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: 'User deleted Successfully',
  });
});
