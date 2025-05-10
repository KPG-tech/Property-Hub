const express = require('express');
const router = express.Router();
const { 
  getProperties, 
  getPropertySlots, 
  createBooking, 
  updateBookingStatus,
  getUserBookings,
  updateBooking,
  deleteBooking,
  getSellerPropertiesWithSlots,
  addPropertySlot,
  updatePropertySlot,
  removePropertySlot,
  cancelConfirmedBooking
} = require('../controllers/bookingController');

router.get('/properties', getProperties);
router.get('/properties/:id/slots', getPropertySlots);
router.post('/bookings', createBooking);
router.put('/bookings/:id', updateBookingStatus);
router.get('/users/:userId/bookings', getUserBookings);
router.put('/bookings/:id/update', updateBooking);
router.delete('/bookings/:id', deleteBooking);
router.get('/sellers/:sellerId/properties-slots', getSellerPropertiesWithSlots);
router.post('/properties/:propertyId/slots', addPropertySlot);
router.put('/properties/:propertyId/slots/:slotId', updatePropertySlot);
router.delete('/properties/:propertyId/slots/:slotId',removePropertySlot)
router.delete('/bookings/:bookingId/cancel', cancelConfirmedBooking);

module.exports = router;