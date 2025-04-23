const Review = require("../models/Review");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { checkPermissions } = require("../utils");
const { StatusCodes } = require("http-status-codes");

const createReview = async (req, res) => {
  if (!req.body) {
    throw new CustomError.BadRequest("Body cannot be blank");
  }
  const { product } = req.body;
  const checkProduct = await Product.findById(product);
  if (!checkProduct) {
    throw new CustomError.NotFound(
      `No product with product id ${product} found`
    );
  }
  req.body.user = req.user.userId;
  const alreadySubmitted = await Review.findOne({
    product,
    user: req.body.user,
  });
  if (alreadySubmitted) {
    throw new CustomError.BadRequest("User already submitted the review");
  }
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReview = async (req, res) => {
  const reviews = await Review.find()
    .populate({
      path: "product",
      select: "name company price",
    })
    .populate({ path: "user", select: "name" });
  res.status(StatusCodes.OK).json({ reviews });
};

const getSingleReview = async (req, res) => {
  const { id } = req.params;
  const review = await Review.findById(id);
  if (!review) {
    throw new CustomError.NotFound(`No review with id ${id} present`);
  }
  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req, res) => {
  if (!req.body) {
    throw new CustomError.BadRequest(
      "Please provide atleast rating, title or comment"
    );
  }
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFound(`No review with id ${reviewId} found`);
  }
  checkPermissions(req.user, review.user);
  if (rating) {
    review.rating = rating;
  }
  if (title) {
    review.title = title;
  }
  if (comment) {
    review.comment = comment;
  }
  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new CustomError.NotFound(`No review with id ${reviewId} found`);
  }
  checkPermissions(req.user, review.user);
  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Review removed" });
};

module.exports = {
  createReview,
  getAllReview,
  getSingleReview,
  updateReview,
  deleteReview,
};
