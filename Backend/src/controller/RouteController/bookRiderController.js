import UserModel from "../../Models/authmodel.js";
import rideModel from "../../Models/rideModels.js";
import DriverModel from "../../Models/driverProfile.js";
import { model } from "mongoose";
import Payment from "../../Models/paymentModel.js";

const EARTH_RADIUS_KM = 6371;
function haversineDistance([lng1, lat1], [lng2, lat2]) {
  const toRad = (v) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
//
const BookrideController = async (req, res) => {
  try {
    let userId = req.user.id;
    const { origin, destination } = req.body;

    const nearestDriver = await DriverModel.findOne({
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: origin.coordinates,
          },
          $maxDistance: 1000000, // in meters (2000 km)
        },
      },
    });

    if (!nearestDriver) {
      return res.status(400).json({ msg: "No Avaiable drivers nearby" });
    }
    const distance = haversineDistance(
      origin.coordinates,
      destination.coordinates
    );

    let fare = parseFloat((distance * 15).toFixed(2)); // 15/km
    const eta = Math.ceil(distance / 0.5); // assuming 30km/h speed

    const newRide = new rideModel({
      user: userId,
      driver: nearestDriver._id,
      origin,
      destination,
      distance: distance,
      fare,
      eta,
    });
    nearestDriver.isAvailable = false;
    await nearestDriver.save();
    await newRide.save();
    res.status(201).json(newRide);
  } catch (err) {
    console.error("Ride booking error:", err);
    res.status(500).json({ message: "Failed to book ride" });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await rideModel
      .find({ user: userId })
      .populate({
        path: "driver",
        select: "phone vehicleType vehicleNumber rating",
        model: DriverModel,
        populate: {
          path: "user", // Assuming the driver references a user in the authmodel
          select: "name", // Fetch the name from the authmodel
          model: UserModel,
        },
      })
      .populate({
        path: "payment", // Populate payment details
        select: "paymentStatus amount method", // Include desired fields from Payment model
        model: Payment,
      })
      .sort({ createdAt: -1 }); // latest first

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Ensure the payment field is populated in the response
    bookings.forEach((booking) => {
      if (!booking.payment) {
        booking.payment = null; // Set to null if payment is not found
      }
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Failed to fetch booking details:", error);
    res.status(500).json({ message: "Failed to get booking details" });
  }
};
const handleCancelRideController = async (req, res) => {
  try {
    // const { id } = req.body;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ msg: "Ride ID is required" });
    }
    // Find the ride by ID
    const ride = await rideModel.findById(id);
    if (!ride) {
      return res.status(404).json({ msg: "Ride not found" });
    }

    // Find the driver associated with the ride
    const driver = await DriverModel.findById(ride.driver);
    if (driver) {
      // Mark the driver as available again
      driver.isAvailable = true;
      await driver.save();
    }

    // Delete the ride from the database
    await rideModel.findByIdAndDelete(id);

    res.status(200).json({ msg: "Ride canceled successfully" });
  } catch (error) {
    console.error("Failed to cancel ride:", error);
    res.status(500).json({ msg: "Failed to cancel ride" });
  }
};

export default {
  BookrideController,
  getBookingDetails,
  handleCancelRideController,
};
