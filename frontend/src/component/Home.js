import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8070/propertyBooking/properties')
      .then(response => setProperties(response.data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      axios.get(`http://localhost:8070/propertyBooking/properties/${selectedProperty}/slots`)
        .then(response => setSlots(response.data))
        .catch(error => console.error(error));
    }
  }, [selectedProperty]);

  const handleBooking = async () => {
    try {
      const response = await axios.post('http://localhost:8070/propertyBooking/bookings', {
        propertyId: selectedProperty,
        userId: '67e4161d34de40d36aeeea4b',
        date: selectedSlot.date.split('T')[0],
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });
      setBookingStatus('Booking request sent successfully!');
      setSelectedSlot(null);
    } catch (error) {
      setBookingStatus('Error creating booking');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Available Properties</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(property => (
          <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{property.title}</h3>
              <p className="text-gray-600">{property.address}</p>
              <button
                onClick={() => setSelectedProperty(selectedProperty === property._id ? null : property._id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
              >
                {selectedProperty === property._id ? 'Hide Slots' : 'View Available Slots'}
              </button>
            </div>
            {selectedProperty === property._id && (
              <div className="p-4 bg-gray-50">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Book a Viewing</h4>
                <select
                  onChange={(e) => setSelectedSlot(slots[e.target.value])}
                  className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a time slot</option>
                  {slots.filter(slot => !slot.isBooked).map((slot, index) => (
                    <option key={index} value={index}>
                      {new Date(slot.date).toLocaleDateString()} {slot.startTime} - {slot.endTime}
                    </option>
                  ))}
                </select>
                {selectedSlot && (
                  <button
                    onClick={handleBooking}
                    className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                  >
                    Request Viewing
                  </button>
                )}
                {bookingStatus && <p className="mt-2 text-sm text-gray-600">{bookingStatus}</p>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;