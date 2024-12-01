const { Schema, model } = require("mongoose");
const bcryptjs = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: { type: String },
    resetTokenExpiration: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcryptjs.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcryptjs.compare(password, this.password);
};

const UserModel = model("User", userSchema);
module.exports = UserModel;
