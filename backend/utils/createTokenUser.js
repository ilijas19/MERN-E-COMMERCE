const createTokenUser = (user) => {
  return {
    username: user.username,
    email: user.email,
    userId: user._id,
    isAdmin: user.isAdmin,
  };
};

export default createTokenUser;
