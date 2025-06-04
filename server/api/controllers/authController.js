const bcrypt = require("bcrypt");
const User = require("../models/User");

// Employee Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  console.log(user);
  console.log(password);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log("incorrect password");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // req.session.user = user.username;
  req.session.user = { id: user._id, username: user.username };
  console.log("✅ Session after login:", req.session);
  res.json({ message: "Login successful" });
};

// Check if user is authenticated
exports.checkAuth = (req, res) => {
  // console.log(req.session.user);
  if (req.session.user) {
    console.log("authenticated");
    return res.json({ authenticated: true });
  }
  res.status(401).json({ authenticated: false });
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
};
