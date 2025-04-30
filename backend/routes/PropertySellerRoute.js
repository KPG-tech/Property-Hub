const express = require('express');
const router = express.Router();
const { addProperty, getAllProperties, updateProperty, deleteProperty, upload,getPropertyById } = require('../controllers/PropertyController');

// Route to add a property
router.post('/addproperty', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }
    next();
  });
}, addProperty);

// Route to get all properties
router.get('/properties', getAllProperties);

// Route to update a property by ID
router.put('/updateproperty/:id', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: 'Image upload failed', error: err.message });
    }
    next();
  });
}, updateProperty);
// Route to get a property by ID
router.get('/properties/:id', getPropertyById);

// Route to delete a property by ID
router.delete('/deleteproperty/:id', deleteProperty);

module.exports = router;