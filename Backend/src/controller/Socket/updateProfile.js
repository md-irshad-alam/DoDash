import DriverModel from "../../Models/driverProfile.js";
import rideModel from "../../Models/rideModels.js";

const updateDriverLiveLocation = async ({ driverId, lat, lng, io, socket }) => {
  try {
    // 1. Update driver location in DB
    const driver = await DriverModel.findByIdAndUpdate(
      driverId,
      {
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
        socketId: socket.id,
        lastOnline: new Date(),
      },
      { new: true }
    );

    // 2. Find the ride that this driver is assigned to
    const activeRide = await rideModel.findOne({
      driver: driverId,
      status: { $in: ["requested", "ongoing"] }, // ongoing rides
    });

    if (activeRide) {
      // 3. Calculate new ETA from driver's current location to destination
      const distance = haversineDistance(
        [lng, lat],
        activeRide.destination.coordinates
      );

      const newEta = Math.ceil(distance / 0.5); // assuming 30km/h speed

      // 4. Optional: Update ride's ETA field in DB (if you want to persist it)
      activeRide.eta = newEta;
      await activeRide.save();

      // 5. Emit the updated location and ETA to the frontend
      io.emit(`locationUpdate:${activeRide._id}`, {
        location: driver.location,
        eta: newEta,
      });
    }
  } catch (err) {
    console.error("Live location update failed:", err.message);
  }
};

export default updateDriverLiveLocation;
