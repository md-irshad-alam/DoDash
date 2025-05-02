import DriverModel from "../../Models/driverModel.js";

// Register new DriverModel
const registerDriver = async (req, res) => {
  try {
    const DriverModel = await DriverModel.create(req.body);
    res.status(201).json(DriverModel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update DriverModel availability (toggle online/offline)
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const DriverModel = await DriverModel.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );
    res.json(DriverModel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update DriverModel location (for tracking and matching)
const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    const DriverModel = await DriverModel.findByIdAndUpdate(
      id,
      {
        location: {
          type: "Point",
          coordinates: [lng, lat],
        },
      },
      { new: true }
    );

    res.json(DriverModel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  registerDriver,
  updateAvailability,
  updateLocation,
};
