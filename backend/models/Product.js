import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      maxLength: 20,
      default: "Review",
    },
    comment: {
      type: String,
      required: [true, "Review comment must be provided"],
      maxLength: 60,
    },
    rating: {
      type: Number,
      required: [true, "Review rating must be provided"],
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Review User must be provided"],
    },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Must be provided"],
    },
    image: {
      type: String,
      required: [true, "image must be provided"],
    },
    brand: {
      type: String,
      required: [true, "brand must be provided"],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      required: [true, "Category must be provided"],
    },
    description: {
      type: String,
      required: [true, "description must be provided"],
      maxLength: 60,
    },
    reviews: [ReviewSchema],
    price: {
      type: Number,
      required: [true, "price must be provided"],
      min: 0,
    },
    countInStock: {
      type: Number,
      required: [true, "Count in Stock must be provided"],
      min: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("averageRating").get(function () {
  if (!this.reviews.length) return 0;
  return (
    this.reviews.reduce((acc, review) => acc + review.rating, 0) /
    this.reviews.length
  ).toFixed(1);
});

ProductSchema.virtual("numReviews").get(function () {
  return this.reviews.length;
});
const Product = mongoose.model("Product", ProductSchema);
export default Product;
