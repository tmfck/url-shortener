import mongoose from "mongoose";
import config from "../util/config.js";

await mongoose.connect(`mongodb://${config.mongoHost}:${config.mongoPort}/url-shortener`);

const urlSchema = new mongoose.Schema({
  url: { type: String, required: true },
  subpart: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

export default mongoose.model('Url', urlSchema);
