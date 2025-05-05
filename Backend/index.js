import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import autroutes from "./src/Routes/auth.js";
import driverroutes from "./src/Routes/driverprofile.js";
import connection from "./src/controller/dbConnection/dbConnections.js";
import { Server } from "socket.io";

import bookRoute from "./src/Routes/bookRide.js";
import rideModel from "./src/Models/rideModels.js";
const port = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // restrict in production
  },
});

app.use(cors());
app.use(express.json());
//  route handler
app.use("/api/auth", autroutes);
app.use("/api/driver", driverroutes);
app.use("/api", bookRoute);
// controller for the live update(Socket.io )

// io.on("connection", (socket) => {
//   socket.on("liveLocationUpdate", (data) => {
//     updateDriverLiveLocation({ ...data, io, socket });
//   });

//   socket.on("disconnect", () => {
//     console.log("Socket disconnected:", socket.id);
//   });
// });

io.on("connection", (socket) => {
  socket.on("rideCompleted", async ({ rideId }) => {
    try {
      const ride = await rideModel.findById(rideId);
      if (ride) {
        ride.status = "completed";
        await ride.save();
        console.log(`Ride ${rideId} marked as completed.`);
      }
    } catch (err) {
      console.error("Error updating ride status:", err);
    }
  });
});

server.listen(port, () => {
  try {
    connection();
    console.log("server is live");
  } catch (error) {
    console.log(error);
    throw new Error("Server Internal Error", error);
  }
});
