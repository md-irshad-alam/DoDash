// models/rideModel.js
import mongoose from "mongoose";

const RideSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    origin: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [Number],
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    destination: {
      type: {
        type: String,
        default: "Point",
      },
      coordinates: [Number],
    },
    distance: Number,
    fare: Number,
    status: {
      type: String,
      enum: ["requested", "accepted", "cancelled", "completed"],
      default: "requested",
    },
    eta: Number,
  },
  { timestamps: true }
);

RideSchema.index({ origin: "2dsphere" });

const rideModel = mongoose.model("Ride", RideSchema);
export default rideModel;
