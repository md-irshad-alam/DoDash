import UserModel from "../../Models/authmodel.js";
import DriverModel from "../../Models/driverProfile.js";

// Register new DriverModel
const registerDriver = async (req, res) => {
  try {
    const user = req.user.id;

    const driver = await DriverModel.create({ ...req.body, user });
    res.status(201).json(driver);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update DriverModel availability (toggle online/offline)
const updateAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { isAvailable } = req.body;
    console.log(userId);
    console.log(req.body);
    const driver = await DriverModel.findOneAndUpdate(
      { user: userId },
      { isAvailable },
      { new: true }
    );
    console.log(driver);
    res.send({ message: "online status changed", driver });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const GetAllDriverInfoCont = async (req, res) => {
  try {
    const userId = req.user.id;

    const driverInfo = await DriverModel.find().populate({
      path: "user",
      select: "name",
      model: UserModel,
    });
    if (!driverInfo || driverInfo.length === 0) {
      return res.send({ message: "Empty Driver list" });
    }
    res.send({ driver: driverInfo });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error !", error });
  }
};

// Update DriverModel location (for tracking and matching)

export default {
  registerDriver,
  updateAvailability,
  GetAllDriverInfoCont,
};
