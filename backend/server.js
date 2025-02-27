// import express from "express";
// import cors from "cors";
// import connectDB from "./database/page.js";
// import usermodel from "./models/Userschema.js";
// const PORT = 5000;
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import dotenv from 'dotenv';
// dotenv.config(); // Load variables into `process.env`
// import cookieParser from 'cookie-parser'; 
// import Message from "./models/Message.js";
// import { Server } from "socket.io"; 



// const app = express();
// app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:3000', // Your frontend URL
//   credentials: true, // Allow credentials (cookies)
// }));
// connectDB();
// app.use(cookieParser()); // Middleware to parse cookies
// // const token = cookies.get("token")?.value;
// app.post("/createaccount", async (req, res) => {
//   const { email, password, username, profilephoto } = req.body;

//   try {
//     const existingMail = await usermodel.findOne({ email });
//     const existingusername = await usermodel.findOne({ username });

//     if (existingMail) return res.status(400).json({ message: "Email already exists" });
//     if (existingusername) return res.status(400).json({ message: "Username already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new usermodel({ email, password: hashedPassword, username, profilephoto: profilephoto });
//     await user.save();

//     res.status(200).json({ message: "User added successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// const SECRET_KEY = process.env.JWT_TOKEN;

// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   console.log(email,password);

//   try {
//     const existmail = await usermodel.findOne({ email });
    
//     if (existmail) {
//       const match = await bcrypt.compare(password, existmail.password);
//       if (match) {
//         const token = jwt.sign({ userId: existmail._id, email: existmail.email }, SECRET_KEY, { expiresIn: "23h" });
//         res.cookie('token', token, { httpOnly: true, maxAge: 23 * 60 * 60 * 1000 }); // Set JWT token in cookies
//         return res.status(200).json({ message: "Login successful", token });
//       } else {
//         return res.status(401).json({ message: "Invalid credentials" });
//       }
//     } else {
//       return res.status(404).json({ message: "User not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Internal server error", error: error.message });
//   }
// });



 

// // Route to get user data after token validation
// app.post("/decode", async (req, res) => {
//   const token = req.body.token; // Get token from the request body
//   console.log('Token received:', token);

//   if (!token) {
//     console.log('No token provided');
//     return res.status(401).json({ message: "No token provided" });
//   }

//   try {
//     // Verify the token
//     jwt.verify(token, process.env.JWT_TOKEN, async (err, decoded) => {
//       if (err) {
//         console.log('Token verification failed:', err.message);
//         return res.status(403).json({ message: "Invalid or expired token" });
//       }

//       console.log('Token decoded:', decoded);

//       // Fetch user data if token is valid
//       const user = await usermodel.findById(decoded.userId);

//       if (!user) {
//         console.log('User not found for ID:', decoded.userId);
//         return res.status(404).json({ message: "User not found" });
//       }

//       console.log('User data fetched:', user);

//       return res.status(200).json({
//         username: user.username,
//         profilePicture: user.profilephoto,
//       });
//     });
//   } catch (error) {
//     console.log('Server error:', error.message);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

// app.get("/search-users", async (req, res) => {
//   try {
//     const { query } = req.query; // Get search query from request

//     if (!query) {
//       return res.status(400).json({ message: "Search query is required" });
//     }

//     // Search users by username (case-insensitive)
//     const users = await usermodel.find({
//       username: { $regex: query, $options: "i" }, // Case-insensitive regex search
//     });

//     return res.status(200).json(users);
//   } catch (error) {
//     console.error("Search error:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
import express from "express";
import cors from "cors";
import connectDB from "./database/page.js";
import usermodel from "./models/Userschema.js";
import Message from "./models/Message.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(cookieParser());

// Connect to MongoDB
connectDB();

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.IO connection
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);

//   // Join a room based on user ID or chat pair
//   socket.on("join", (userId) => {
//     socket.join(userId);
//     console.log(`${userId} joined their room`);
//   });

//   // Handle sending messages
//   socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
//     try {
//       // Save message to database
//       const message = new Message({
//         sender: senderId,
//         receiver: receiverId,
//         text,
//       });
//       await message.save();

//       // Emit message to sender and receiver
//       io.to(senderId).to(receiverId).emit("receiveMessage", {
//         sender: senderId,
//         receiver: receiverId,
//         text,
//         createdAt: message.createdAt,
//       });
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // Existing routes...

// // Create account
// app.post("/createaccount", async (req, res) => {
//   const { email, password, username, profilephoto } = req.body;
//   try {
//     const existingMail = await usermodel.findOne({ email });
//     const existingUsername = await usermodel.findOne({ username });

//     if (existingMail) return res.status(400).json({ message: "Email already exists" });
//     if (existingUsername) return res.status(400).json({ message: "Username already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new usermodel({ email, password: hashedPassword, username, profilephoto });
//     await user.save();

//     res.status(200).json({ message: "User added successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Use env variable
    pass: process.env.EMAIL_PASS, // Use env variable (App Password for Gmail)
  },
});

const OTPs = {}; // In-memory OTP storage (temporary; use Redis/MongoDB for production)

// Send OTP Route
app.post("/send-otp", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  OTPs[email] = { code: otp, expires: Date.now() + 10 * 60 * 1000 }; // Expires in 10 minutes

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Error sending email:", err);
      return res.status(500).json({ message: "Failed to send OTP", error: err.message });
    }
    console.log("Email sent:", info.response);
    return res.status(200).json({ message: "OTP sent successfully" });
  });
});

// Verify OTP Route
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  const storedOTP = OTPs[email];
  if (!storedOTP) return res.status(400).json({ message: "No OTP found for this email" });

  if (Date.now() > storedOTP.expires) {
    delete OTPs[email];
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (parseInt(otp) === storedOTP.code) {
    delete OTPs[email]; // OTP is single-use
    return res.status(200).json({ message: "OTP verified successfully" });
  }
  return res.status(400).json({ message: "Invalid OTP" });
});

// Modified Create Account Route (with OTP verification)
app.post("/createaccount", async (req, res) => {
  const { email, password, username, profilephoto, isVerified } = req.body;

  // Check if OTP was verified
  if (!isVerified) {
    return res.status(400).json({ message: "Please verify your email with OTP first" });
  }

  try {
    const existingMail = await usermodel.findOne({ email });
    const existingUsername = await usermodel.findOne({ username });

    if (existingMail) return res.status(400).json({ message: "Email already exists" });
    if (existingUsername) return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new usermodel({ email, password: hashedPassword, username, profilephoto });
    await user.save();

    res.status(200).json({ message: "User added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// (Rest of your existing routes like /login, /decode, etc., remain unchanged)

// Socket.IO and Server Start
io.on("connection", (socket) => {
  socket.on("join", (userId) => socket.join(userId));
  socket.on("sendMessage", async ({ senderId, receiverId, text }) => {
    const message = new Message({ sender: senderId, receiver: receiverId, text });
    await message.save();
    io.to(senderId).to(receiverId).emit("receiveMessage", {
      sender: senderId,
      receiver: receiverId,
      text,
      createdAt: message.createdAt,
    });
  });
});
// Login
const SECRET_KEY = process.env.JWT_TOKEN;
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await usermodel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id, email: user.email }, SECRET_KEY, { expiresIn: "23h" });
    res.cookie("token", token, { httpOnly: true, maxAge: 23 * 60 * 60 * 1000 });
    res.status(200).json({ message: "Login successful", token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Decode token
app.post("/decode", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await usermodel.findById(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      userId: user._id, // Add userId here
      username: user.username,
      profilePicture: user.profilephoto,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Search users
app.get("/search-users", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Search query is required" });

  try {
    const users = await usermodel.find({
      username: { $regex: query, $options: "i" },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Fetch chat history
app.get("/messages/:userId/:receiverId", async (req, res) => {
  const { userId, receiverId } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error: error.message });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});