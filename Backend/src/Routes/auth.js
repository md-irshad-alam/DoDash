import express from "express";
const autroutes = express.Router();
import authController from "../controller/RouteController/AuthController.js";
import authMiddleware from "../Middleware/authmiddleware.js";
autroutes.post("/register", authMiddleware, authController.registerUser);
autroutes.post("/login", authMiddleware, authController.loginUser);

export default autroutes;
