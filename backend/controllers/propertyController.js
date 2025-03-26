// const Property = require('../models/Property');
// const Booking = require('../models/Booking');
// const User = require('../models/User');
// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'dineth.info2002@gmail.com',
//     pass: 'omab cspg wung zeez' // Use app-specific password
//   }
// });

// exports.getProperties = async (req, res) => {
//   try {
//     const properties = await Property.find().populate('owner', 'name email');
//     res.json(properties);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.getPropertySlots = async (req, res) => {
//   try {
//     const property = await Property.findById(req.params.id);
//     if (!property) {
//       return res.status(404).json({ message: 'Property not found' });
//     }
//     res.json(property.availableSlots);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.createBooking = async (req, res) => {
//     try {
//       const { propertyId, userId, date, startTime, endTime } = req.body;
      
//       const property = await Property.findById(propertyId).populate('owner');
//       if (!property) return res.status(404).json({ message: 'Property not found' });
  
//       const slot = property.availableSlots.find(slot => 
//         slot.date.toISOString().split('T')[0] === date && 
//         slot.startTime === startTime && 
//         !slot.isBooked
//       );
  
//       if (!slot) return res.status(400).json({ message: 'Slot not available' });
  
//       const booking = new Booking({
//         property: propertyId,
//         user: userId,
//         date,
//         startTime,
//         endTime
//       });
  
//       slot.isBooked = true;
//       await property.save();
//       await booking.save();
  
//       // Notify seller
//       await transporter.sendMail({
//         from: 'dineth.info2002@gmail.com',
//         to: property.owner.email,
//         subject: 'New Booking Request',
//         text: `A new viewing request for ${property.title} on ${date} at ${startTime}`
//       });
  
//       res.status(201).json(booking);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   exports.updateBookingStatus = async (req, res) => {
//     try {
//       const { status } = req.body;
//       const booking = await Booking.findById(req.params.id)
//         .populate('user')
//         .populate('property');
      
//       if (!booking) return res.status(404).json({ message: 'Booking not found' });
  
//       booking.status = status;
      
//       if (status === 'confirmed') {
//         await transporter.sendMail({
//           from: 'dineth.info2002@gmail.com',
//           to: booking.user.email,
//           subject: 'Booking Confirmed',
//           text: `Your viewing for ${booking.property.title} on ${booking.date.toLocaleDateString()} at ${booking.startTime} has been confirmed!`
//         });
//       } else if (status === 'rejected') {
//         const property = await Property.findById(booking.property);
//         const slot = property.availableSlots.find(slot => 
//           slot.date.toISOString().split('T')[0] === booking.date.toISOString().split('T')[0] &&
//           slot.startTime === booking.startTime
//         );
//         if (slot) {
//           slot.isBooked = false;
//           await property.save();
//         }
//       }
  
//       await booking.save();
//       res.json(booking);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   exports.getUserBookings = async (req, res) => {
//     try {
//       const bookings = await Booking.find({ user: req.params.userId })
//         .populate('property', 'title address');
//       res.json(bookings);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   exports.updateBooking = async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id).populate('property');
//       const { date, startTime, endTime } = req.body;
  
//       const timeDifference = new Date(booking.date) - new Date();
//       if (timeDifference < 24 * 60 * 60 * 1000) { // Less than 24 hours
//         return res.status(400).json({ message: 'Cannot modify booking within 24 hours' });
//       }
  
//       // Free up old slot
//       const property = await Property.findById(booking.property._id);
//       const oldSlot = property.availableSlots.find(slot => 
//         slot.date.toISOString().split('T')[0] === booking.date.toISOString().split('T')[0] &&
//         slot.startTime === booking.startTime
//       );
//       if (oldSlot) oldSlot.isBooked = false;
  
//       // Book new slot
//       const newSlot = property.availableSlots.find(slot => 
//         slot.date.toISOString().split('T')[0] === date &&
//         slot.startTime === startTime &&
//         !slot.isBooked
//       );
//       if (!newSlot) return res.status(400).json({ message: 'New slot not available' });
  
//       newSlot.isBooked = true;
//       booking.date = date;
//       booking.startTime = startTime;
//       booking.endTime = endTime;
//       booking.status = 'pending';
  
//       await property.save();
//       await booking.save();
  
//       await transporter.sendMail({
//         from: 'dineth.info2002@gmail.com',
//         to: booking.property.owner.email,
//         subject: 'Booking Updated',
//         text: `Booking for ${booking.property.title} has been updated to ${date} at ${startTime}`
//       });
  
//       res.json(booking);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  
//   exports.deleteBooking = async (req, res) => {
//     try {
//       const booking = await Booking.findById(req.params.id).populate('property');
      
//       const timeDifference = new Date(booking.date) - new Date();
//       if (timeDifference < 24 * 60 * 60 * 1000) {
//         return res.status(400).json({ message: 'Cannot cancel booking within 24 hours' });
//       }
  
//       const property = await Property.findById(booking.property._id);
//       const slot = property.availableSlots.find(slot => 
//         slot.date.toISOString().split('T')[0] === booking.date.toISOString().split('T')[0] &&
//         slot.startTime === booking.startTime
//       );
//       if (slot) slot.isBooked = false;
  
//       await property.save();
//       await booking.deleteOne();
  
//       await transporter.sendMail({
//         from: 'dineth.info2002@gmail.com',
//         to: booking.property.owner.email,
//         subject: 'Booking Cancelled',
//         text: `Booking for ${booking.property.title} on ${booking.date.toLocaleDateString()} at ${booking.startTime} has been cancelled`
//       });
  
//       res.json({ message: 'Booking deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };


const Property = require('../models/Property');
const Booking = require('../models/Booking');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dineth.info2002@gmail.com',
    pass: 'omab cspg wung zeez' // App-specific password
  }
});

// Function to compile email template
const compileTemplate = (templateName, data) => {
  const filePath = path.join(__dirname, '../templates', `${templateName}.hbs`);
  const source = fs.readFileSync(filePath, 'utf-8');
  const template = handlebars.compile(source);
  return template(data);
};

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPropertySlots = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.json(property.availableSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { propertyId, userId, date, startTime, endTime } = req.body;
    
    const property = await Property.findById(propertyId).populate('owner');
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const slot = property.availableSlots.find(slot => 
      slot.date.toISOString().split('T')[0] === date && 
      slot.startTime === startTime && 
      !slot.isBooked
    );

    if (!slot) return res.status(400).json({ message: 'Slot not available' });

    const booking = new Booking({
      property: propertyId,
      user: userId,
      date,
      startTime,
      endTime
    });

    slot.isBooked = true;
    await property.save();
    await booking.save();

    // Send beautiful email to seller
    const html = compileTemplate('bookingRequest', {
      ownerName: property.owner.name,
      propertyTitle: property.title,
      date,
      startTime,
      endTime
    });

    await transporter.sendMail({
      from: 'dineth.info2002@gmail.com',
      to: property.owner.email,
      subject: 'New Booking Request',
      html
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id)
      .populate('user')
      .populate('property');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    
    if (status === 'confirmed') {
      const html = compileTemplate('bookingConfirmed', {
        userName: booking.user.name,
        propertyTitle: booking.property.title,
        date: booking.date.toLocaleDateString(),
        startTime: booking.startTime
      });

      await transporter.sendMail({
        from: 'dineth.info2002@gmail.com',
        to: booking.user.email,
        subject: 'Booking Confirmed',
        html
      });
    } else if (status === 'rejected') {
      const property = await Property.findById(booking.property);
      const slot = property.availableSlots.find(slot => 
        slot.date.toISOString().split('T')[0] === booking.date.toISOString().split('T')[0] &&
        slot.startTime === booking.startTime
      );
      if (slot) {
        slot.isBooked = false;
        await property.save();
      }
    }

    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate('property', 'title address');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('property');
    const { date, startTime, endTime } = req.body;

    const timeDifference = new Date(booking.date) - new Date();
    if (timeDifference < 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Cannot modify booking within 24 hours' });
    }

    const property = await Property.findById(booking.property._id);
    const oldSlot = property.availableSlots.find(slot => 
      slot.date.toISOString().split('T')[0] === booking.date.toISOString().split('T')[0] &&
      slot.startTime === booking.startTime
    );
    if (oldSlot) oldSlot.isBooked = false;

    const newSlot = property.availableSlots.find(slot => 
      slot.date.toISOString().split('T')[0] === date &&
      slot.startTime === startTime &&
      !slot.isBooked
    );
    if (!newSlot) return res.status(400).json({ message: 'New slot not available' });

    newSlot.isBooked = true;
    booking.date = date;
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.status = 'pending';

    await property.save();
    await booking.save();

    const html = compileTemplate('bookingUpdated', {
      ownerName: booking.property.owner.name,
      propertyTitle: booking.property.title,
      date,
      startTime
    });

    await transporter.sendMail({
      from: 'dineth.info2002@gmail.com',
      to: booking.property.owner.email,
      subject: 'Booking Updated',
      html
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('property');
    
    const timeDifference = new Date(booking.date) - new Date();
    if (timeDifference < 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Cannot cancel booking within 24 hours' });
    }

    const property = await Property.findById(booking.property._id);
    const slot = property.availableSlots.find(slot => 
      slot.date.toISOString().split('T')[0] === booking.date.toISOString().split('T')[0] &&
      slot.startTime === booking.startTime
    );
    if (slot) slot.isBooked = false;

    await property.save();
    await booking.deleteOne();

    const html = compileTemplate('bookingCancelled', {
      ownerName: booking.property.owner.name,
      propertyTitle: booking.property.title,
      date: booking.date.toLocaleDateString(),
      startTime: booking.startTime
    });

    await transporter.sendMail({
      from: 'dineth.info2002@gmail.com',
      to: booking.property.owner.email,
      subject: 'Booking Cancelled',
      html
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};