import express from "express";
import bookingControll from "../controller/RouteController/bookRiderController.js";
import authMiddleware from "../Middleware/authmiddleware.js";
const bookRoute = express.Router();

bookRoute.post(
  "/ride/book",
  authMiddleware,
  bookingControll.BookrideController
);
bookRoute.get(
  "/ride/driver/info",
  authMiddleware,
  bookingControll.getBookingDetails
);
bookRoute.delete(
  "/ride/cancel/:id",
  authMiddleware,
  bookingControll.handleCancelRideController
);

export default bookRoute;
