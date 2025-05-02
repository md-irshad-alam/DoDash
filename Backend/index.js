import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import autroutes from "./src/Routes/auth.js";
import connection from "./src/controller/dbConnection/dbConnections.js";
const port = process.env.PORT || 8080;

const app = express();
app.use(cors());
//  route handler
app.use("/api", autroutes);
// listen the server

app.listen(port, () => {
  try {
    connection();
    console.log("server is live");
  } catch (error) {
    console.log(error);
    throw new Error("Server Internal Error", error);
  }
});
