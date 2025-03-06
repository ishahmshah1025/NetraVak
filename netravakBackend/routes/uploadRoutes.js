import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // Generate unique IDs
import Media from "../models/mediaModel.js";
import z from "zod";
import bcrypt from "bcrypt"
import User from "../models/userModel.js";
import express from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";


router.post("/upload", upload.fields([{ name: "audio" }, { name: "image" }]), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !req.files["audio"] || !req.files["image"]) {
      return res.status(400).json({ error: "Name, audio, and image are required!" });
    }

    const audioBase64 = req.files["audio"][0].buffer.toString("base64");
    const imageBase64 = req.files["image"][0].buffer.toString("base64");

    // Generate a unique userID (e.g., "john-abc123")
    const userID = `${name.toLowerCase()}-${uuidv4().slice(0, 6)}`;

    const newMedia = new Media({ name, userID, audio: audioBase64, image: imageBase64 });
    await newMedia.save();

    res.json({ message: "Files uploaded successfully!", userID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch media by userID
router.get("/media/:userID", async (req, res) => {
  try {
    const media = await Media.findOne({ userID: req.params.userID });
    if (!media) return res.status(404).json({ error: "Media not found" });

    res.json(media);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/register", async function (req, res) {
  // 🛠️ Fixing Zod Schema Validation
  const bodySchema = z.object({
    phoneno: z.string().length(10, "Phone number must be 10 digits"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters")
  });

  const parsedBody = bodySchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res.status(400).json({ error: parsedBody.error.errors }); // Returns detailed validation errors
  }

  try {
    const { phoneno, email, password } = parsedBody.data; // Extract valid data

    // 🛠️ Check if user already exists
    const existingUser = await User.findOne({
      email: req.body.email,
      phoneno: req.body.phoneno
    }); 
  
    if (existingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 🛠️ Creating the new user
    await User.create({
      phoneno,
      email,
      password: hashedPassword,
      verified: false
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const storage = multer.memoryStorage(); // Stores file in memory
const upload = multer({ storage: storage });

router.post("/upload/aadhar", upload.single("file"), async function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // 🛠️ Create FormData for Axios
    const formData = new FormData();
    formData.append("file", req.file.buffer, { filename: req.file.originalname });

    // 🛠️ Send to FastAPI endpoint
    const response = await axios.post("http://0.0.0.0:8000/extract", formData, {
      headers: {
        ...formData.getHeaders(), // Sets correct Content-Type
      },
    });

    return res.status(200).json(response.data); // Send FastAPI response back to client
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
