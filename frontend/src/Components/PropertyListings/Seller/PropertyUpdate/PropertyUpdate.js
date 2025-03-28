import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PropertyUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    price: '',
    phone: '',
    address: '',
    description: '',
    images: []
  });
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8070/api/properties/${id}`)
      .then(response => {
        setFormData(response.data);
      })
      .catch(error => {
        console.error('Error fetching property details:', error);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages([...newImages, ...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        formDataToSubmit.append(key, formData[key]);
      }
    });

    // Append new images if available
    if (newImages.length > 0) {
      newImages.forEach((image) => {
        formDataToSubmit.append('images', image);
      });
    }


    // Send updated property details along with images
    axios.put(`http://localhost:8070/api/updateproperty/${id}`, formDataToSubmit)
      .then(response => {
        alert('Property updated successfully!');
        navigate(`/sellerPropertyDetails`);
      })
      .catch(error => {
        alert('Error updating property:', error);
      });
  };

  return (
    <div>
      <p className='add_pro_topic'>Update Property Details</p>
      <form className="addpropertyfrom" onSubmit={handleSubmit} encType="multipart/form-data">
        <div className='auth_card_from_input'>
          <label className='auth_card_lable'>Title</label>
          <input className='auth_card_input' type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className='auth_card_from_input'>
          <label className='auth_card_lable'>Property Type</label>
          <select className='auth_card_input' name="type" value={formData.type} onChange={handleChange} required>
            <option value="">Select a type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>
        <div className='auth_card_from_input'>
          <label className='auth_card_lable'>Price</label>
          <input className='auth_card_input' type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>
        <div className='auth_card_from_input'>
          <label className='auth_card_lable'>Phone Number</label>
          <input className='auth_card_input' type="number" name="phone" value={formData.phone} onChange={(e) => {
            const re = /^[0-9\b]{0,10}$/;
            if (re.test(e.target.value)) {
              handleChange(e);
            }
          }}
            maxLength="10"
            pattern="[0-9]{10}"
            title="Please enter exactly 10 digits."
            required />
        </div>
        <div className='auth_card_from_input'>
          <label className='auth_card_lable'>Address</label>
          <textarea className='auth_card_input' name="address" value={formData.address} onChange={handleChange} required rows={3} />
        </div>
        <div className='auth_card_from_input'>
          <label className='auth_card_lable'>Description</label>
          <textarea className='auth_card_input' name="description" value={formData.description} onChange={handleChange} required rows={5} />
        </div>
        {/* Display existing images */}
        <div className='auth_card_from_input'>
          <p></p>
          <label className='auth_card_lable'>Images</label>
          <p className='condi'>You need upload 4 images.</p>
          <input
            type="file"
            id="image-upload"
            name="images"
            accept="image/*"
            multiple
            className='auth_card_input'
            onChange={handleImageChange}
          />
          <p className='condi'>Existing Images </p>
          <div className="selected-images">
            {formData.images.length > 0 ? (
              formData.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:8070/${image}`}
                  alt={`PropertyImage ${index + 1}`}
                  className="preview-img"
                />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>
        </div>

        <button className='from_btn'>Update Details</button>
      </form>
    </div>
  );
}

export default PropertyUpdate;
