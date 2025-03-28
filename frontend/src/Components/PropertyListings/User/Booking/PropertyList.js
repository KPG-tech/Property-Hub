import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PropertyList = ({ onSelectProperty }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8070/propertyBooking/properties')
      .then(response => setProperties(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h2>Available Properties</h2>
      {properties.map(property => (
        <div key={property._id}>
          <h3>{property.title}</h3>
          <p>{property.address}</p>
          <button onClick={() => onSelectProperty(property._id)}>
            View Available Slots
          </button>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;