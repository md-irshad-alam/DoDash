import express from "express";
const driverroutes = express.Router();
import driverProfileController from "../controller/RouteController/DriverController.js";
import authMiddleware from "../Middleware/authmiddleware.js";
import paymentController from "../controller/RouteController/paymentController.js";
driverroutes.post(
  "/create",
  authMiddleware,
  driverProfileController.registerDriver
);
driverroutes.put(
  "/availability",
  authMiddleware,
  driverProfileController.updateAvailability
);

driverroutes.post(
  "/user/payment",
  authMiddleware,
  paymentController.processPayment
);
driverroutes.get(
  "/user/get-payment",
  authMiddleware,
  paymentController.getPaymentInfo
);
driverroutes.get(
  "/driver-info",
  authMiddleware,
  driverProfileController.GetAllDriverInfoCont
);
export default driverroutes;
