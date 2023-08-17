import https from "https";
import fs, { readFile } from 'fs';
import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// import routes
import employeesRoutes from "./routes/employees.routes.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); //
const app = express();

// middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb"})); // for parsing application/json
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// handling errors

// routes
app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/employees", employeesRoutes);

// start server
const DB_PORT = process.env.DB_PORT || 6001;


https
  .createServer(
    {
      key: fs.readFileSync("key.pem"),
      cert: fs.readFileSync("certificate.pem")
    },
    app)
  .listen(DB_PORT, () => {
  console.log("Server is running at port 3001!");
});
