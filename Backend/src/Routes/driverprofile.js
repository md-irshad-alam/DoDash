import express from "express";
const driverroutes = express.Router();
import driverProfileController from "../controller/RouteController/DriverController.js";
import authMiddleware from "../Middleware/authmiddleware.js";
driverroutes.post(
  "/create",
  authMiddleware,
  driverProfileController.registerDriver
);
driverroutes.post(
  "/availability",
  authMiddleware,
  driverProfileController.updateAvailability
);
driverroutes.post(
  "/locationUpdate",
  authMiddleware,
  driverProfileController.updateLocation
);

export default driverroutes;
