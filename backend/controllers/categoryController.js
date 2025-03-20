import { StatusCodes } from "http-status-codes";
import Category from "../models/Category.js";
import CustomError from "../errors/errorIndex.js";
import Product from "../models/Product.js";

const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new CustomError.BadRequestError("Name Must Be Provided");
  }
  await Category.create({ name });
  res.status(StatusCodes.CREATED).json({ msg: "Category Created" });
};

const getAllCategories = async (req, res) => {
  const categories = await Category.find({}).select("-__v");
  res.status(StatusCodes.OK).json({ categories });
};

const get3Categories = async (req, res) => {
  const categories = await Category.find({}).select("-__v");
  res.status(StatusCodes.OK).json({ categories });
};

const getSingleCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Category Name Must Be Provided");
  }
  const category = await Category.findOne({ _id: id }).select("-__v");
  if (!category) {
    throw new CustomError.NotFoundError("Category Not Found");
  }
  res.status(StatusCodes.OK).json({ category });
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id) {
    throw new CustomError.BadRequestError("Category Name Must Be Provided");
  }
  if (!name) {
    throw new CustomError.BadRequestError("Name Must Be Provided");
  }
  const category = await Category.findOne({ _id: id });
  if (!category) {
    throw new CustomError.NotFoundError("Category Not Found");
  }
  category.name = name;
  await category.save();
  res.status(StatusCodes.OK).json({ msg: "Category Updated" });
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Category Id Must Be Provided");
  }
  const category = await Category.findOne({ _id: id });
  if (!category) {
    throw new CustomError.NotFoundError("Category Not Found");
  }
  await category.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Category Deleted" });
};

const getProductsByCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  if (!categoryId) {
    throw new CustomError.BadRequestError("Category Id needs to be provided");
  }
  const category = await Category.findOne({ _id: categoryId });
  if (!category) {
    throw new CustomError.NotFoundError("No Category with specified id");
  }
  const products = await Product.find({ category: categoryId }).limit(4);
  res.status(StatusCodes.OK).json({ products });
};

export {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  get3Categories,
  getProductsByCategory,
};
