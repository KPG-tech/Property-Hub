const Property = require('../models/Property');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4();
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage }).array('images', 4);

// Add a new property
const addProperty = async (req, res) => {
  try {
    const {
      title,
      type,
      price,
      phone,
      address,
      description,
      sellerID,
      availableSlots,
      pastPrices // Add pastPrices to receive from frontend
    } = req.body;

    const images = req.files.map(file => file.path);

    // Parse availableSlots and pastPrices if they come as strings
    let slots = availableSlots;
    let prices = pastPrices;
    if (typeof availableSlots === 'string') {
      slots = JSON.parse(availableSlots);
    }
    if (typeof pastPrices === 'string') {
      prices = JSON.parse(pastPrices);
    }

    // Convert pastPrices object to array of { year, price } objects
    const pastPricesArray = prices ? Object.keys(prices).map((key, index) => ({
      year: index + 1, // e.g., year1 -> 1, year2 -> 2, etc.
      price: parseFloat(prices[key]) // Convert price to number
    })) : [];

    // Validate minimum 5 years of price history
    if (!pastPricesArray || pastPricesArray.length < 5) {
      return res.status(400).json({ message: 'Minimum 5 years of price history required' });
    }

    // Validate that all prices are valid numbers
    const invalidPrice = pastPricesArray.some(entry => isNaN(entry.price) || entry.price <= 0);
    if (invalidPrice) {
      return res.status(400).json({ message: 'All past prices must be valid positive numbers' });
    }

    const newProperty = new Property({
      title,
      type,
      price,
      phone,
      address,
      description,
      sellerID,
      images,
      owner: sellerID,
      availableSlots: slots || [],
      pastPrices: pastPricesArray // Store past prices as array
    });

    await newProperty.save();
    res.status(201).json({ message: 'Property added successfully', property: newProperty });
  } catch (error) {
    res.status(500).json({ message: 'Error adding property', error: error.message });
  }
};

// Get all properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
};

// Get a property by ID
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
};

// Update a property
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      type, 
      price, 
      phone, 
      address, 
      description,
      availableSlots,
      pastPrices // Add pastPrices for updates
    } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    let images = property.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    // Parse availableSlots and pastPrices if they come as strings
    let slots = availableSlots;
    let prices = pastPrices;
    if (typeof availableSlots === 'string') {
      slots = JSON.parse(availableSlots);
    }
    if (typeof pastPrices === 'string') {
      prices = JSON.parse(pastPrices);
    }

    // Validate minimum 5 years of price history if pastPrices is provided
    if (prices && prices.length < 5) {
      return res.status(400).json({ message: 'Minimum 5 years of price history required' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { 
        title, 
        type, 
        price, 
        phone, 
        address, 
        description, 
        images,
        availableSlots: slots || property.availableSlots,
        pastPrices: prices || property.pastPrices
      },
      { new: true }
    );

    res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
  } catch (error) {
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProperty = await Property.findByIdAndDelete(id);
    if (!deletedProperty) return res.status(404).json({ message: 'Property not found' });

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
};

module.exports = { addProperty, getAllProperties, updateProperty, deleteProperty, upload, getPropertyById };