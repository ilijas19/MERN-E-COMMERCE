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

  const oneDay = 1000 * 60 * 60 * 24;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;

  res.cookie("accessToken", accessTokenJwt, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJwt, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: new Date(Date.now() + oneWeek),
  });
};
