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
        const currentDate = new Date();
        const futureSlots = response.data.filter(slot => {
          const slotDateTime = new Date(`${slot.date.split('T')[0]}T${slot.startTime}`);
          return slotDateTime >= currentDate && !slot.isBooked;
        });
        setSlots(futureSlots);
      } catch (error) {
        console.error(error);
        setBookingStatus('Error loading slots');
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
        userId: '67e69eada0d1f11b129d382e',
        date: selectedSlot.date.split('T')[0],
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });
      setBookingStatus('Booking confirmed successfully!');
      setSelectedSlot(null);
      setTimeout(() => navigate('/my-bookings'), 2000);
    } catch (error) {
      setBookingStatus('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-indigo-900 tracking-wide">
            Book Your Property Tour
          </h2>
          <p className="mt-3 text-lg text-purple-700">Pick a time that works for you!</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-purple-600"></div>
          </div>
        )}

        {/* Slots Display */}
        {!loading && slots.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md mx-auto">
            <p className="text-xl font-medium text-gray-700">No slots available right now</p>
            <p className="mt-3 text-gray-500">Check back soon for new openings!</p>
          </div>
        ) : (
          !loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`relative bg-gradient-to-br from-white to-indigo-50 rounded-3xl shadow-lg p-6 cursor-pointer 
                    transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl 
                    ${selectedSlot === slot ? 'ring-4 ring-purple-500 scale-105 bg-indigo-100' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                        Open Slot
                      </span>
                      {selectedSlot === slot && (
                        <span className="text-pink-500 font-medium animate-pulse">Selected</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900">
                      {new Date(slot.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </h3>
                    <div className="flex items-center space-x-3 text-purple-800">
                      <svg className="w-6 h-6 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="font-medium">{slot.startTime} - {slot.endTime}</p>
                    </div>
                  </div>
                  {selectedSlot === slot && (
                    <button
                      onClick={handleBooking}
                      className="mt-5 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-xl 
                        hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-60 
                        disabled:cursor-not-allowed font-semibold"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Book Now'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {/* Status Message */}
        {bookingStatus && (
          <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 max-w-sm w-full p-4 rounded-xl shadow-2xl 
            ${bookingStatus.includes('Error') || bookingStatus.includes('Failed') 
              ? 'bg-red-600 text-white' 
              : 'bg-green-500 text-white'} 
            transition-all duration-500`}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{bookingStatus}</p>
              <button
                onClick={() => setBookingStatus('')}
                className="text-white hover:text-gray-200 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertySlots;