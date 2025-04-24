const { StatusCodes } = require("http-status-codes");
const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = "random";
  return { client_secret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    throw new CustomError.NotFound(`No order with id ${id} found`);
  }
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const order = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ order });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body || {};
  if (!cartItems || cartItems.length < 1) {
    throw new CustomError.BadRequest("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new CustomError.BadRequest("Please provide tax and shipping fee");
  }
  let orderItems = [];
  let subTotal = 0;
  for (const item of cartItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new CustomError.NotFound(
        `No product with id ${item.product} found`
      );
    }
    const { name, price, image, _id } = product;
    const singleOrderItem = {
      name,
      price,
      image,
      amount: item.amount,
      product: _id,
    };
    orderItems = [...orderItems, singleOrderItem];
    subTotal += item.amount * price;
  }
  const total = subTotal + tax + shippingFee;
  const paymentIntent = await fakeStripeAPI({ amount: total, currency: "usd" });
  const order = await Order.create({
    orderItems,
    total,
    subTotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.client_secret,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json({ order });
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { paymentIntentId } = req.body;
  const order = await Order.findById(id);
  if (!order) {
    throw new CustomError.BadRequest(`No order with id ${id} found`);
  }
  checkPermissions(req.user, order.user);
  order.paymentIntentId = paymentIntentId;
  order.status = "paid";
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrderStatus,
};
