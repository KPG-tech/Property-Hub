import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './propertyDetails.css';

function PropertyDetails() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const SelleruserId = localStorage.getItem('SelleruserId');
  
    axios.get('http://localhost:8070/api/properties')
      .then(response => {
        const filteredProperties = response.data.filter(property => property.sellerID === SelleruserId);
        setProperties(filteredProperties);
      })
      .catch(error => {
        console.error('Error fetching properties:', error);
      });
  }, []);
  

  const handleDelete = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this property?');
    if (isConfirmed) {
      axios.delete(`http://localhost:8070/api/deleteproperty/${id}`)
        .then(() => {
          setProperties(properties.filter(property => property._id !== id));
          window.alert('Property deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting property:', error);
        });
    }
  };
  
  const handleUpdate = (id) => {
    navigate(`/updateproperty/${id}`);
  };

  const generatePDF = () => {
    const doc = new jsPDF('landscape');
    doc.text('Property Details', 20, 10);
  
    const tableColumn = ['Title', 'Type', 'Price', 'Phone', 'Address', 'Description'];
    const tableRows = properties.map(property => [
      property.title, 
      property.type, 
      property.price, 
      property.phone, 
      property.address, 
      property.description
    ]);
  
    autoTable(doc, { // Correct usage
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });
  
    doc.save('property_details.pdf');
  };
  return (
    <div>
      <p className='add_pro_topic'>Property Details</p>
      <div className='propty_continner_acton'>
      <button type='button' className='serch_btn' onClick={()=>(window.location.href='/sellerAddProperty')}>Add Property</button>
        <div className='serch_con'>
          <input 
            type='text' 
            className='serch_br' 
            placeholder='Search here..' 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button type='button' className='serch_btn' onClick={generatePDF}>Generate PDF</button>
      </div>
      <div className='table_continer_seller_main'>
        <div className='table_continer_seller'>
          <table className='table_seller'>
            <thead>
              <tr className='table_seller_row'>
                <th className='table_seller_hed'>Title</th>
                <th className='table_seller_hed'>Type</th>
                <th className='table_seller_hed'>Price</th>
                <th className='table_seller_hed'>Phone</th>
                <th className='table_seller_hed'>Address</th>
                <th className='table_seller_hed'>Description</th>
                <th className='table_seller_hed'>Images</th>
                <th className='table_seller_hed'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.filter(property => 
                property.title.toLowerCase().includes(searchTerm.toLowerCase())
              ).map(property => (
                <tr className='table_seller_row' key={property._id}>
                  <td className='table_seller_data'>{property.title}</td>
                  <td className='table_seller_data'>{property.type}</td>
                  <td className='table_seller_data'>${property.price}</td>
                  <td className='table_seller_data'>{property.phone}</td>
                  <td className='table_seller_data'>{property.address}</td>
                  <td className='table_seller_data'>{property.description}</td>
                  <td className='table_seller_data'>
                    <div className='test_imge_con'>
                      {property.images.map((image, index) => (
                        <img key={index} src={`http://localhost:8070/${image}`} alt='' className='test_imge' />
                      ))}
                    </div>
                  </td>
                  <td className='table_seller_data'>
                    <div className='new_btn_set'>
                      <button type='button' className='udate_btn' onClick={() => handleUpdate(property._id)}>Update</button>
                      <button type='button' className='dlt_btn' onClick={() => handleDelete(property._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;
