import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingForm = ({ propertyId }) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:8070/propertyBooking/properties/${propertyId}/slots`)
      .then(response => setSlots(response.data))
      .catch(error => console.error(error));
  }, [propertyId]);

  const handleBooking = async () => {
    try {
      const response = await axios.post('http://localhost:8070/propertyBooking/bookings', {
        propertyId,
        userId: '67e4161d34de40d36aeeea4b', // Replace with actual user ID from auth
        date: selectedSlot.date.split('T')[0],
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });
      setBookingStatus('Booking request sent successfully!');
    } catch (error) {
      setBookingStatus('Error creating booking');
    }
  };

  return (
    <div>
      <h2>Book a Viewing</h2>
      <select 
        onChange={(e) => {
          const slot = slots[e.target.value];
          setSelectedSlot(slot);
        }}
      >
        <option value="">Select a time slot</option>
        {slots.filter(slot => !slot.isBooked).map((slot, index) => (
          <option key={index} value={index}>
            {new Date(slot.date).toLocaleDateString()} {slot.startTime} - {slot.endTime}
          </option>
        ))}
      </select>
      {selectedSlot && (
        <button onClick={handleBooking}>Request Viewing</button>
      )}
      {bookingStatus && <p>{bookingStatus}</p>}
    </div>
  );
};

export default BookingForm;