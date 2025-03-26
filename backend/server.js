// package ekama adala eka variable ekakata save karanawa, ethakota variable ekenma ekapara call karanna puluwan :)

const express = require("express"); // declare dependencies
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000; // 8070 OR 8070 eka nattan wena available ekak

dotenv.config(); // Load environment variables

app.use(cors()); // declare karapuwa use karanawa
app.use(bodyParser.json());

// MongoDB URI
const uri = 'mongodb+srv://it22638854:Radeesa@cluster0.mfucu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const URL = "mongodb+srv://kavishkapathum:200113105017@cluster0.8b0nu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB Connection Function
const connect = async () => {
  try {
    console.log('Connected to MongoDB');
  }
  catch (error) {
    console.log('MongoDB Error: ', error);
  }
};

// Connect to MongoDB
connect(); // Call the connect function to establish the connection

// Alternatively, you were trying to connect using mongoose directly


const connection = mongoose.connection; // hadagatta connection eka open karagannawa
connection.once("open", () => {
  console.log("Mongodb connection success!"); // if success
});

// Routes
const authRouter = require("./routes/authRoutes.js");
const pricepredictRouter = require("./routes/pricepredictRoutes.js");

app.use("/auth", authRouter);
app.use("/propertyfuture", pricepredictRouter);
app.use("/api/payment", require("./routes/Payment")); // used in Express.js to register routes from a separate file

// Start Server
app.listen(PORT, () => {
  // ara port eka listn krnna
  console.log(`Server is up and running on port number: ${PORT}`);
});
