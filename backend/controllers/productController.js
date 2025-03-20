import { StatusCodes } from "http-status-codes";
import Product from "../models/Product.js";
import User from "../models/User.js";
import CustomError from "../errors/errorIndex.js";

const createProduct = async (req, res) => {
  const { name, image, brand, category, description, price, countInStock } =
    req.body;

  if (
    !name ||
    !image ||
    !brand ||
    !category ||
    !description ||
    !price ||
    !countInStock
  ) {
    throw new CustomError.BadRequestError("All Credientials Must Be Provided");
  }
  const product = await Product.create({
    name,
    image,
    brand,
    category,
    description,
    price,
    countInStock,
  });
  res.status(StatusCodes.CREATED).json({ msg: "Product Created" });
};

const getAllProducts = async (req, res) => {
  const { name, brand, category, price, page = 1 } = req.query;
  const limit = 9;
  const skip = (Number(page) - 1) * limit;

  const queryObject = {};

  if (name && name !== "") {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (category && category !== "") {
    queryObject.category = category;
  }

  if (price && price !== "") {
    const priceQuery = {};
    if (price.gte) priceQuery.$gte = Number(price.gte);
    if (price.lte) priceQuery.$lte = Number(price.lte);

    if (Object.keys(priceQuery).length > 0) {
      queryObject.price = priceQuery;
    }
  }

  const products = await Product.find(queryObject)
    .populate({
      path: "category",
      select: "name",
    })
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(queryObject);
  const totalPages = Math.ceil(totalProducts / limit);

  res.status(StatusCodes.OK).json({
    nbHits: products.length,
    page: Number(page),
    nextPage: totalPages > Number(page) ? Number(page) + 1 : null,
    products,
    totalProducts,
  });
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Product Id Needs To Be Specified");
  }
  const product = await Product.findOne({ _id: id }).populate({
    path: "category",
    select: "name",
  });

  if (!product) {
    throw new CustomError.NotFoundError("Product Not Found");
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, image, brand, category, description, price, countInStock } =
    req.body;
  if (!id) {
    throw new CustomError.BadRequestError("Id Must be Provided");
  }
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new CustomError.NotFoundError("Product Not Found");
  }
  product.name = name || product.name;
  product.image = image || product.image;
  product.brand = brand || product.brand;
  product.category = category || product.category;
  product.description = description || product.description;
  product.price = price || product.price;
  product.countInStock = countInStock || product.countInStock;
  await product.save();
  res.status(StatusCodes.OK).json({ msg: "Product Updated" });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Id Must Be Provided");
  }
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new CustomError.BadRequestError("Product Not Found");
  }
  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Product Deleted" });
};

const getTopProducts = async (req, res) => {
  const products = await Product.find({});

  const sortedProducts = products
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, 4);

  res.status(StatusCodes.OK).json({ products: sortedProducts });
};
const getNewProducts = async (req, res) => {
  const products = await Product.find({}).sort("createdAt").limit(5);
  res.status(StatusCodes.OK).json({ products });
};

const addReview = async (req, res) => {
  const { id } = req.params;
  const { title, comment, rating } = req.body;
  if (!title || !comment || !rating) {
    throw new CustomError.BadRequestError("All Credientials Must Be Provided");
  }
  if (!id) {
    throw new CustomError.BadRequestError("Product Id needs to be provided");
  }
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new CustomError.NotFoundError("Product Not Found");
  }
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user.userId.toString()
  );
  if (alreadyReviewed) {
    throw new CustomError.NotFoundError("You already reviewed this product");
  }
  product.reviews.push({
    title,
    comment,
    rating,
    user: req.user.userId,
  });
  await product.save();
  res.status(StatusCodes.OK).json({ msg: "Review added" });
};

const toggleFavoriteProduct = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Id Must Be Provided");
  }
  const product = await Product.findOne({ _id: id });
  if (!product) {
    throw new CustomError.NotFoundError("Product not found");
  }
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Authentication Failed");
  }
  const isFavorite = user.favorites.some(
    (fav) => fav.toString() === id.toString()
  );
  if (isFavorite) {
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== id.toString()
    );
    await user.save();
    return res.status(StatusCodes.OK).json({ msg: "Removed From Favorites" });
  } else {
    user.favorites.push(id);
    await user.save();
    return res.status(StatusCodes.OK).json({ msg: "Added To Favorites" });
  }
};

const getFavoriteProducts = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).populate({
    path: "favorites",
  });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Authentication failed");
  }
  res.status(StatusCodes.OK).json({ favorites: user.favorites });
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getTopProducts,
  getNewProducts,
  addReview,
  toggleFavoriteProduct,
  getFavoriteProducts,
};
