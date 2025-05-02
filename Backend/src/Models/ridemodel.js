const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema(
  {
    userId: String,
    driverId: String,
    pickup: {
      lat: Number,
      lng: Number,
    },
    dropoff: {
      lat: Number,
      lng: Number,
    },
    status: {
      type: String,
      enum: ["requested", "ongoing", "completed", "cancelled"],
      default: "requested",
    },
    fare: Number,
    driverLocation: {
      lat: Number,
      lng: Number,
    },
  },
  { timestamps: true }
);

const rideModel = mongoose.model("Ride", RideSchema);
export default rideModel;
