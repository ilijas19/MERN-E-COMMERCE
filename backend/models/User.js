import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username Must Be Provided"],
      maxLength: 16,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email Must Be Provided"],
      unique: true,
      validate: {
        validator: function (e) {
          return validator.isEmail(e);
        },
        message: (prop) => `${prop.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: [true, "Password Must Be Provided"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
