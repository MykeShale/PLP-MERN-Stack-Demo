import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Signup Controller
export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Return response with token
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Signin Controller
export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      message: "Signin successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.log("Signin Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
