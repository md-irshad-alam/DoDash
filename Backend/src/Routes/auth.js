import express from "express";
const autroutes = express.Router();
import authController from "../controller/RouteController/AuthController.js";
import authMiddleware from "../Middleware/authmiddleware.js";
autroutes.post("/register", authController.registerUser);
autroutes.post("/login", authController.loginUser);

export default autroutes;
