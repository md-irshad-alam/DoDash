import mongoose from "mongoose";

const DriverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link to the User model where role = "Driver"
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },
    vehicleType: {
      type: String,
      enum: ["Sedan", "SUV", "Hatchback", "Bike"],
      default: "Sedan",
    },
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: "2dsphere",
      },
    },
    rating: {
      type: Number,
      default: 5.0,
    },
    totalRides: {
      type: Number,
      default: 0,
    },
    socketId: {
      type: String,
    },
    lastOnline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const DriverModel = mongoose.model("Driver", DriverSchema);
export default DriverModel;
