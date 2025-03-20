import CustomError from "../errors/errorIndex.js";
import { attachCookiesToResponse, verifyJwt } from "../utils/jwt.js";
import Token from "../models/Token.js";
import { StatusCodes } from "http-status-codes";

export const authenticateUser = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  if (accessToken) {
    const decoded = verifyJwt(accessToken);
    req.user = decoded.user;
    return next();
  }
  if (refreshToken) {
    const decoded = verifyJwt(refreshToken);
    const token = await Token.findOne({
      user: decoded.user.userId,
      refreshToken: decoded.refreshToken,
    });
    if (!token || !token?.isValid) {
      throw new CustomError.UnauthenticatedError("Authentication failed");
    }

    req.user = decoded.user;
    return next();
  }
  throw new CustomError.UnauthenticatedError("Authentication failed");
};

export const getUserAuthenticate = async (req, res, next) => {
  const { accessToken, refreshToken } = req.signedCookies;
  if (accessToken) {
    const decoded = verifyJwt(accessToken);
    req.user = decoded.user;
    return next();
  }
  if (refreshToken) {
    const decoded = verifyJwt(refreshToken);
    const token = await Token.findOne({
      user: decoded.user.userId,
      refreshToken: decoded.refreshToken,
    });
    if (!token || !token?.isValid) {
      return res.status(StatusCodes.OK).json({ currentUser: null });
    }

    req.user = decoded.user;
    return next();
  }
  return res.status(StatusCodes.OK).json({ currentUser: null });
};

export const authorizeAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    throw new CustomError.UnauthorizedError(
      "Not Authorized to access this route"
    );
  }
  return next();
};
