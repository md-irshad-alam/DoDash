import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: true,
  },
  tokenExpiration: {
    type: Date,
    index: { expires: 0 }, // This activates the TTL
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
