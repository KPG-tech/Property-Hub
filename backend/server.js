const express = require("express"); // Import Express
const mongoose = require("mongoose"); // Import Mongoose
const bodyParser = require("body-parser"); // Import Body-Parser
const cors = require("cors"); // Import CORS
const dotenv = require("dotenv"); // Import Dotenv
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Enable JSON body parsing

// MongoDB URI from environment variable
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://kavishkapathum:200113105017@cluster0.8b0nu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB Connection Function
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Error: ", error);
    process.exit(1); // Exit process on failure
  }
};

// Connect to MongoDB
connectDB();

// Connection Event Listener
mongoose.connection.once("open", () => {
  console.log("MongoDB Connection Established!");
});

// Routes
const authRouter = require("./routes/authRoutes");
const pricepredictRouter = require("./routes/pricepredictRoutes");
const paymentRouter = require("./routes/Payment");

app.use("/auth", authRouter);
app.use("/propertyfuture", pricepredictRouter);
app.use("/api/payment", paymentRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
