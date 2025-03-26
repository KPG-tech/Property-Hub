const express = require('express');
const router = express.Router();
const { 
  getProperties, 
  getPropertySlots, 
  createBooking, 
  updateBookingStatus,
  getUserBookings,
  updateBooking,
  deleteBooking
} = require('../controllers/propertyController');

router.get('/properties', getProperties);
router.get('/properties/:id/slots', getPropertySlots);
router.post('/bookings', createBooking);
router.put('/bookings/:id', updateBookingStatus);
router.get('/users/:userId/bookings', getUserBookings);
router.put('/bookings/:id/update', updateBooking);
router.delete('/bookings/:id', deleteBooking);

module.exports = router;