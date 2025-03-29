import { StatusCodes } from "http-status-codes";
import User from "../models/User.js";
import Token from "../models/Token.js";
import CustomError from "../errors/errorIndex.js";
import createTokenUser from "../utils/createTokenUser.js";
import crypto from "crypto";
import { attachCookiesToResponse } from "../utils/jwt.js";

//public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new CustomError.BadRequestError("All Credientials must be provided");
  }
  const emailInUse = await User.findOne({ email });
  if (emailInUse) {
    throw new CustomError.BadRequestError("Email is already in use");
  }
  const user = await User.create({ username, email, password });
  res.status(StatusCodes.OK).json({ msg: "Account Created" });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("All Credientials must be provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError(
      "No Account found with specified email"
    );
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Wrong Password");
  }
  const existingToken = await Token.findOne({ user: user._id });
  const tokenUser = createTokenUser(user);
  if (existingToken) {
    //existing token
    attachCookiesToResponse({
      res,
      user: tokenUser,
      refreshToken: existingToken.refreshToken,
    });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successful", tokenUser });
  } else {
    //no existing token
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const refreshToken = crypto.randomBytes(40).toString("hex");
    await Token.create({ user: tokenUser.userId, ip, refreshToken, userAgent });
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    return res
      .status(StatusCodes.OK)
      .json({ msg: "Login Successful", tokenUser });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  await Token.findOneAndDelete({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ msg: "Logout" });
};

const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ currentUser: req.user });
};

const getUserProfile = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select("-password");

  return res.status(StatusCodes.OK).json({ user });
};

const updateUserProfile = async (req, res) => {
  const { username, email, oldPassword, newPassword, confirmPassword } =
    req.body;
  const user = await User.findOne({ _id: req.user.userId });
  if (!user) {
    throw new CustomError.NotFoundError("Error finding profile");
  }
  user.username = username || user.username;
  user.email = email || user.email;
  if (newPassword && newPassword !== "") {
    if (!oldPassword || oldPassword === "") {
      throw new CustomError.BadRequestError("Old Password must be provided");
    }
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new CustomError.BadRequestError("Wrong Password");
    }
    if (newPassword !== confirmPassword) {
      throw new CustomError.BadRequestError("Passwords do not match");
    }
    user.password = newPassword;
  }
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Profile Updated" });
};

//admin
const getAllUsers = async (req, res) => {
  const limit = 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;
  const totalUsers = await User.countDocuments();
  const totalPages = Math.ceil(totalUsers / limit);
  const nextPage = page < totalPages;

  const queryObject = {};

  const { username } = req.query;

  if (username) {
    queryObject.username = { $regex: username, $options: "i" };
  }

  const users = await User.find(queryObject)
    .skip(skip)
    .limit(limit)
    .select("-password");

  res
    .status(StatusCodes.OK)
    .json({ nbHits: users.length, page, nextPage, users, totalUsers });
};
const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Id must be provided");
  }
  const user = await User.findOne({ _id: id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError("No user with specified id");
  }
  res.status(StatusCodes.OK).json({ user });
};
const deleteUserById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Id must be provided");
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError("No user with specified id");
  }
  await user.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "User Deleted" });
};
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  if (!id) {
    throw new CustomError.BadRequestError("Id must be provided");
  }
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new CustomError.NotFoundError("No user with specified id");
  }
  user.username = username || user.username;
  user.email = email || user.email;
  user.password = password || user.password;
  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Profile Updated" });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  getCurrentUser,
};
