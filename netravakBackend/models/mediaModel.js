import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userID: { type: String, unique: true, required: true },
  audio: String,  
  image: String,  
});

const Media = mongoose.model("Media", mediaSchema);
export default Media;
