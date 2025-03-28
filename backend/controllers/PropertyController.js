const Property = require('../models/Property');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Add this line at the top of your file
// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4(); // Generate a unique identifier
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Append the file extension
  }
});

const upload = multer({ storage: storage }).array('images', 4); // Allow up to 4 images

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
      availableSlots // Add this to receive time slots
    } = req.body;
    
    const images = req.files.map(file => file.path);
    
    // Parse availableSlots if it comes as a string
    let slots = availableSlots;
    if (typeof availableSlots === 'string') {
      slots = JSON.parse(availableSlots);
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
      owner:sellerID,
      availableSlots: slots || [] // Add empty array as default if no slots provided
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
    const { title, type, price, phone, address, description } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    let images = property.images; // Retain existing images
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path); // Use new images if uploaded
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      { title, type, price, phone, address, description, images },
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