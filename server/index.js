import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

// import routes
import employeesRoutes from "./routes/employees.routes.js";

dotenv.config(); //
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb", extended: true })); // for parsing application/json
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// handling errors

// routes
app.use("employees", employeesRoutes);

// start server
const DB_PORT = process.env.DB_PORT || 6001;
app.listen(DB_PORT, () => {
  console.log("Server is running!");
});
