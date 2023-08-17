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
var allowedOrigins = ['http://localhost:3000',
                      'https://localhost:3001',
                      'https://oboe-network1.service.local:3001',
                      "https://oboe-network-1.kmk10bfmaomnk.eu-west-1.cs.amazonlightsail.com"];

// middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "30mb"})); // for parsing application/json
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

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
