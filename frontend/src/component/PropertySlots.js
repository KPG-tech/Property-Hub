import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PropertySlots = () => {
  const { propertyId } = useParams();
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8070/propertyBooking/properties/${propertyId}/slots`);
        setSlots(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [propertyId]);

  const handleBooking = async () => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8070/propertyBooking/bookings', {
        propertyId,
        userId: '67e4161d34de40d36aeeea4b',
        date: selectedSlot.date.split('T')[0],
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });
      setBookingStatus('Booking request sent successfully!');
      setSelectedSlot(null);
      setTimeout(() => {
        navigate('/my-bookings'); // Redirect to bookings page after success
      }, 2000);
    } catch (error) {
      setBookingStatus('Error creating booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Slots</h2>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slots.filter(slot => !slot.isBooked).map((slot, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow ${
                selectedSlot === slot ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => setSelectedSlot(slot)}
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {new Date(slot.date).toLocaleDateString()}
              </h3>
              <p className="text-gray-600">
                {slot.startTime} - {slot.endTime}
              </p>
              {selectedSlot === slot && (
                <button
                  onClick={handleBooking}
                  className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                >
                  Book This Slot
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {bookingStatus && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          {bookingStatus}
        </div>
      )}
    </div>
  );
};

export default PropertySlots;