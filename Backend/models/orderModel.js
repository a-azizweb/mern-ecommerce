const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // 1 - shipping field of document
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },

    phoneNo: {
      type: Number,
      required: true,
    },
  },

  // 2
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],

  // 3
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },

  // 4
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },

  // 5
  paidAt: {
    type: Date,
    required: true,
  },

  // 6
  itemsPrice: {
    type: Number,
    default: 0,
  },

  // 7
  shippingPrice: {
    type: Number,
    default: 0,
  },

  // 8
  totalPrice: {
    type: Number,
    default: 0,
  },

  // 9
  orderStatus: {
    type: String,
    required: true,
    default: 'Processing',
  },

  // 10
  deliveredAt: Date,

  // 11
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Order', orderSchema);
