const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 60 },
});

// Hash password before saving the user
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next(); // Skip if password hasn't changed

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

module.exports = mongoose.model("User", UserSchema);
