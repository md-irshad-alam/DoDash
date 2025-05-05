import UserModel from "../../Models/authmodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import DriverModel from "../../Models/driverProfile.js";
dotenv.config();

// Validate environment variables
if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password, role = "User" } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const savedUser = await newUser.save();

    // Generate JWT token with role
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION || "24h",
      }
    );

    // Return the token to the client
    return res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Authenticate user and return a JWT
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION || "24h",
      }
    );

    // Return the token to the client
    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const userProfile = async (req, res) => {
  const userId = req.user.id; // Assuming `req.user` is populated by authentication middleware
  console.log(userId);
  try {
    // Fetch user details
    const user = await UserModel.findById(userId).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If the user is a driver, fetch driver profile as well
    let driverProfile = null;
    if (user.role === "Driver") {
      driverProfile = await DriverModel.findOne({ user: user._id });
    }

    // Return user details and driver profile (if applicable)
    res.status(200).json({
      message: "User profile fetched successfully",
      user,
      driverProfile,
    });
  } catch (error) {
    console.error("Error in userProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { registerUser, loginUser, userProfile };
