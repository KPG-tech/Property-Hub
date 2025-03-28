
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Test from './img/loginbk.png';
import ProImg from './img/prp.jpg';
import './PropertyPage.css';
import { FaSearch } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { IoLocation } from "react-icons/io5";

function PropertyPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [predictionLoading, setPredictionLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch properties data from the backend API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:8070/api/properties');
        const data = await response.json();
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  // Filter properties based on selected category and search term
  useEffect(() => {
    let filtered = properties;

    if (selectedCategory) {
      filtered = filtered.filter(property => property.type === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProperties(filtered);
  }, [properties, selectedCategory, searchTerm]);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  const handlePredictPrice = async (property) => {
    setPredictionLoading(true);
    try {
      const requestBody = {
        price: property.price,
        date: new Date().toISOString().split('T')[0],
        location: property.address,
        propertyType: property.type,
        areaSqFt: 10000, // Hardcoded as requested
        nearbyInfrastructure: property.description,
      };

      const response = await fetch('http://localhost:8070/propertyfuture/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const predictionData = await response.json();
      
      // Navigate to prediction page with data
      navigate('/prediction-results', { state: { predictionData } });
    } catch (error) {
      console.error('Error predicting price:', error);
      setPredictionLoading(false);
    }
  };

  return (
    <div>
      <div className="prpty_data_disply_continer_main">
        <div className="prpty_data_disply_continer">
          <div className="prpty_data_card">
            <p className="prpty_data_card_topic">Discover Your Perfect Property!</p>
            <p className="prpty_data_card_pera">"Browse our exclusive listings and find the ideal property that fits your needs. Whether it's your first home or an investment opportunity, we have options for every budget. Start your search today!"</p>
          </div>
          <img src={ProImg} alt='' className='property_card_img_card' />
        </div>
      </div>

      <div className='main_continer'>
        <div className='property_main'>
          <div className='property_main_sub' >
            <div className='property_action_bar'>
              <div className='serch_bar_full'>
                <input
                  type='text'
                  className='search_input'
                  placeholder='Search Here'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className='serch_bar_icon' />
              </div>
              <div className='catagory_con'>
                <p className='topic_cat'>Filter By Category</p>
                <div className='catgoty_btn'>
                  <p className='cat_name' onClick={() => handleCategoryChange('')}>All</p>
                  <p className='cat_name' onClick={() => handleCategoryChange('Apartment')}>Apartment</p>
                  <p className='cat_name' onClick={() => handleCategoryChange('House')}>House</p>
                  <p className='cat_name' onClick={() => handleCategoryChange('Commercial')}>Commercial</p>
                </div>
              </div>
            </div>

            <div className='property_card_continer_full'>
              <div className='property_card_continer'>
                {filteredProperties.map(property => (
                  <div className='property_card' key={property._id}>
                    <div className='property_card_img_continer'>
                      {property.images.map((image, index) => (
                        <img key={index} src={`http://localhost:8070/${image}`} alt='' className='property_card_img' />
                      ))}
                    </div>
                    <p className='property_card_title'>{property.title}</p>
                    <div className='property_type_con'>
                      <p className='price_property'>LKR-{property.price}</p>
                      <p className='property_type'>{property.type}</p>
                    </div>
                    <div>
                      <p className='property_phone'><FaPhone className='FaPhone' /> {property.phone}</p>
                      <p className='property_adddr'><IoLocation className='IoLocation' /> {property.address}</p>
                    </div>
                    <p className="details_prpaty">
                      {property.description.length > 80 ? (
                        <>
                          {isExpanded ? property.description : property.description.slice(0, 80) + "..."}
                          <span
                            className="read_more"
                            onClick={toggleReadMore}
                          >
                            {isExpanded ? " Read Less" : " Read More"}
                          </span>
                        </>
                      ) : (
                        property.description
                      )}
                    </p>

                    {/* New Buttons Section */}
                    <div className="property_card_buttons">
                      <button className="pay_now_btn">Pay Now</button>
                      <button className="book_now_btn">Book Now</button>
                      <button 
                        className="predict_price_btn" 
                        onClick={() => handlePredictPrice(property)}
                        disabled={predictionLoading}
                      >
                        {predictionLoading ? 'Loading...' : 'Predict Price'}
                      </button>
                    </div>
                    
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyPage;
