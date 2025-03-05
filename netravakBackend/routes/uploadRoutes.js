import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid"; // Generate unique IDs
import Media from "../models/mediaModel.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

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

export default router;
