import mongoose from "mongoose";

const connectDb = async (url) => {
  await mongoose.connect(url);
  console.log("Connected to db successfully :)");
};

export default connectDb;
