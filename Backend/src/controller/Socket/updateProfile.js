import DriverModel from "../../Models/driverProfile.js";
const updateDriverLiveLocation = async ({ driverId, lat, lng, io }) => {
  try {
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

    // Emit location to the client who wants to track this driver
    io.emit(`locationUpdate:${driverId}`, driver.location); // Or use rooms for specific clients
  } catch (err) {
    console.error("Location update failed:", err.message);
  }
};

export default updateDriverLiveLocation;
