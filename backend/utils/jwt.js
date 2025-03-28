import jwt from "jsonwebtoken";

const createJwt = ({ payload }) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};

export const verifyJwt = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJwt = createJwt({ payload: { user } });
  const refreshTokenJwt = createJwt({ payload: { user, refreshToken } });

  res.cookie("accessToken", accessTokenJwt, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000,
    sameSite: "strict",
  });

  res.cookie("refreshToken", refreshTokenJwt, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 3600000 * 24,
    sameSite: "strict",
  });
};
