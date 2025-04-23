const { StatusCodes } = require("http-status-codes");
const Product = require("../models/Product");
const Review = require("../models/Review");
const CustomError = require("../errors");
const path = require("path");

const createProduct = async (req, res) => {
  if (!req.body) {
    throw new CustomError.BadRequest("Body cannot be empty");
  }
  req.body.user = req.user.userId;
  const newProduct = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product: newProduct });
};

const getAllProducts = async (req, res) => {
  const allProducts = await Product.find().populate("reviews");
  res
    .status(StatusCodes.OK)
    .json({ products: allProducts, count: allProducts.length });
};

const getSingleProduct = async (req, res) => {
  const singleProduct = await Product.findById(req.params.id).populate(
    "reviews"
  );
  if (!singleProduct) {
    throw new CustomError.NotFound(`No product with id ${req.params.id} found`);
  }
  res.status(StatusCodes.OK).json({ product: singleProduct });
};

const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  if (!product) {
    throw new CustomError.NotFound(`No product with id ${req.params.id} found`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new CustomError.NotFound(`No product with id ${req.params.id} found`);
  }
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Success! Product removed." });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequest("No file uploaded");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequest("Please Upload Image");
  }
  const maxSize = 2 * 1024 * 1024;
  if (productImage.size > maxSize) {
    throw new CustomError.BadRequest("Please upload image size less than 2 MB");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads",
    `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

const getSingleProductReview = async (req, res) => {
  const { id: productId } = req.params;
  const productExists = await Product.findById(productId);
  if (!productExists) {
    throw new CustomError.NotFound(`No product with id ${productId} found`);
  }
  const reviews = await Review.find({ product: productId }).populate({
    path: "user",
    select: "name",
  });
  res.status(StatusCodes.OK).json({ reviews });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProductReview,
};
