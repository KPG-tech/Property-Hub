const mongoose = require('mongoose');
const Property = require('./models/Property');
const User = require('./models/User');

mongoose.connect('mongodb+srv://dineth550:20021213@studentms.q45in7h.mongodb.net/property', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


const properties = [
  {
    title: "Cozy Downtown Apartment",
    address: "123 Main St, Downtown, Cityville",
    owner: "67e414deb8502341e357641c",
    availableSlots: [
      { date: new Date("2025-03-27"), startTime: "10:00 AM", endTime: "11:00 AM", isBooked: false },
      { date: new Date("2025-03-27"), startTime: "2:00 PM", endTime: "3:00 PM", isBooked: false },
      { date: new Date("2025-03-28"), startTime: "1:00 PM", endTime: "2:00 PM", isBooked: false }
    ]
  },
  {
    title: "Spacious Suburban House",
    address: "456 Oak Ave, Suburbia, Cityville",
    owner: "67e414deb8502341e357641c",
    availableSlots: [
      { date: new Date("2025-03-27"), startTime: "11:00 AM", endTime: "12:00 PM", isBooked: false },
      { date: new Date("2025-03-28"), startTime: "3:00 PM", endTime: "4:00 PM", isBooked: false },
      { date: new Date("2025-03-29"), startTime: "10:00 AM", endTime: "11:00 AM", isBooked: false }
    ]
  },
  {
    title: "Luxury Beachfront Condo",
    address: "789 Beach Rd, Coastal Town",
    owner: "67e414deb8502341e357641c",
    availableSlots: [
      { date: new Date("2025-03-27"), startTime: "9:00 AM", endTime: "10:00 AM", isBooked: false },
      { date: new Date("2025-03-28"), startTime: "2:00 PM", endTime: "3:00 PM", isBooked: false },
      { date: new Date("2025-03-29"), startTime: "4:00 PM", endTime: "5:00 PM", isBooked: false }
    ]
  }
];

const seedDB = async () => {
  try {
    await Property.deleteMany({});

    // Insert properties
    await Property.insertMany(properties);
    console.log('Properties seeded successfully');

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

seedDB();