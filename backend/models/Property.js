// models/Property.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const propertySchema = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  sellerID: { type: String, required: true },
  images: [{ type: String, required: true }], // Array of image URLs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Property', propertySchema);