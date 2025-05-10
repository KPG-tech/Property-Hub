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
  createdAt: { type: Date, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
  availableSlots: [{
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false }
  }],
  pastPrices: [{
    year: { type: Number, required: true }, // e.g., 1, 2, 3, 4, 5 (representing years ago)
    price: { type: Number, required: true } // Price for that year
  }]
});

module.exports = mongoose.model('Property', propertySchema);