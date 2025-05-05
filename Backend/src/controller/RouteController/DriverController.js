import DriverModel from "../../Models/driverProfile.js";

// Register new DriverModel
const registerDriver = async (req, res) => {
  try {
    const user = req.user.id;
    console.log(user);
    const driver = await DriverModel.create({ ...req.body, user });
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update DriverModel availability (toggle online/offline)
const updateAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    const driver = await DriverModel.findByIdAndUpdate(
      id,
      { isAvailable },
      { new: true }
    );
    res.json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update DriverModel location (for tracking and matching)

export default {
  registerDriver,
  updateAvailability,
};
