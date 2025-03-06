import mongoose from "mongoose";

const Schema = mongoose.Schema();

const userSchema = new Schema({
  phoneno : {type: Number, required: true, unique: true},
  email : { type: String, required: true, unique: true},
  password : { type: String, required: true},
  verified : {type: Boolean, required: true}
})

const faceSchema = new Schema({
  user_id : {type: Schema.Types.ObjectId, ref: 'User', required: true},
  faceEmbedding : {type: [Number], required: true, unique: true},
})

const voiceSchema = new Schema({
  user_id : {type: Schema.Types.ObjectId, ref: 'User', required: true},
  voiceEmbedding : {type: [Number], required: true, unique: true},
})

const User = mongoose.model('User', userSchema);
const Face = mongoose.model('Face', faceSchema);
const Voice = mongoose.model('Voice', voiceSchema);