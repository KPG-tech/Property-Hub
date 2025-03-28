//package ekama adala eka variable ekakata save karanawa, ethakota variable ekenma ekapara call karanna puluwan :)

const express = require("express"); //declare dependencies
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 8070; //8070 OR 8070 eka nattan wena available ekak
const dotenv = require("dotenv");
app.use(cors()); //declare karapuwa use karanawa
app.use(bodyParser.json());

const URL = "mongodb+srv://kavishkapathum:200113105017@cluster0.8b0nu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(URL, {
  //connect mongodb
  //useCreateIndex: true,
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
  //useFindAndModify: false
});

const connection = mongoose.connection; //hadagatta connection eka open karagannawa
connection.once("open", () => {
  console.log("Mongodb connection success!"); //if success
});

const authRouter = require("./routes/authRoutes.js");
const pricepredictRouter = require("./routes/pricepredictRoutes.js");
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// Routes
app.use('/api', require('./routes/SellerRoute'));
app.use('/api', require('./routes/PropertySellerRoute'));

app.use("/auth", authRouter);
app.use("/propertyfuture",pricepredictRouter);


app.listen(PORT, () => {
  //ara port eka listn krnna
  console.log(`Server is up and running on port number: ${PORT}`);
});