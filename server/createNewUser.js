require("dotenv").config(); // Load environment variables
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");

async function createUser(username, password) {
  try {
    await mongoose.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log("User already exists!");
      mongoose.connection.close();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    console.log(`User ${username} created successfully!`);
    mongoose.connection.close();
  } catch (error) {
    console.error("Error creating user:", error);
    mongoose.connection.close();
  }
}

// Run the function with command-line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log("Usage: node createUser.js <username> <password>");
  process.exit(1);
}

createUser(args[0], args[1]);
