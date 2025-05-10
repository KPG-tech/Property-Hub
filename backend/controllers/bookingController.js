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
    user: 'ddmalalagama@gmail.com',
    pass: 'buvp svnx hhvv vgnl' // App-specific password
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

    // Send email to seller
    const html = compileTemplate('bookingRequest', {
      ownerName: property.owner.name,
      propertyTitle: property.title,
      date,
      startTime,
      endTime
    });

    await transporter.sendMail({
      from: 'ddmalalagama@gmail.com',
      to: property.owner.email,
      subject: 'New Booking Request',
      html
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// exports.updateBookingStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const booking = await Booking.findById(req.params.id)
//       .populate('user')
//       .populate('property');
//
//     if (!booking) return res.status(404).json({ message: 'Booking not found' });
//
//     booking.status = status;
//
//     if (status === 'confirmed') {
//       const html = compileTemplate('bookingConfirmed', {
//         userName: booking.user.name,
//         propertyTitle: booking.property.title,
//         date: booking.date.toLocaleDateString(),
//         startTime: booking.startTime
//       });
//
//       // await transporter.sendMail({
//       //   from: 'ddmalalagama@gmail.com',
//       //   to: booking.user.email,
//       //   subject: 'Booking Confirmed',
//       //   html
//       // });
//     } else if (status === 'rejected') {
//       const property = await Property.findById(booking.property);
//       const slot = property.availableSlots.find(slot =>
//         slot.date.toISOString().split('T')[0] === booking.date.toISOString().split('T')[0] &&
//         slot.startTime === booking.startTime
//       );
//       if (slot) {
//         slot.isBooked = false;
//         await property.save();
//       }
//     }
//
//     await booking.save();
//     res.json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, locationLink } = req.body;
    const booking = await Booking.findById(req.params.id)
        .populate('user')
        .populate('property');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = status;
    if (locationLink) {
      booking.locationLink = locationLink;
    }

    if (status === 'confirmed') {
      const html = compileTemplate('bookingConfirmed', {
        userName: booking.user.name,
        propertyTitle: booking.property.title,
        date: booking.date.toLocaleDateString(),
        startTime: booking.startTime,
        locationLink: booking.locationLink || 'Not provided'
      });

      await transporter.sendMail({
        from: 'ddmalalagama@gmail.com',
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
      from: 'ddmalalagama@gmail.com',
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
      from: 'ddmalalagama@gmail.com',
      to: booking.property.owner.email,
      subject: 'Booking Cancelled',
      html
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New endpoint: Get all properties with their slots and booking details for a seller
exports.getSellerPropertiesWithSlots = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;
    const properties = await Property.find({ sellerID: sellerId })
      .populate('owner', 'name email')
      .lean();

    const result = await Promise.all(properties.map(async (property) => {
      const bookings = await Booking.find({ property: property._id })
        .populate('user', 'fullname email')
        .lean();

      const slotsWithBookingInfo = property.availableSlots.map(slot => {
        const booking = bookings.find(b => 
          b.date.toISOString().split('T')[0] === slot.date.toISOString().split('T')[0] &&
          b.startTime === slot.startTime
        );
        return {
          ...slot,
          isBooked: slot.isBooked,
          bookingStatus: booking ? booking.status : null,
          bookedBy: booking ? { name: booking.user.fullname, email: booking.user.email } : null,
          bookingId: booking ? booking._id : null
        };
      });


      return {
        ...property,
        availableSlots: slotsWithBookingInfo
      };
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New endpoint: Add a new slot to a property
exports.addPropertySlot = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { date, startTime, endTime } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Check if slot already exists
    const slotExists = property.availableSlots.some(slot =>
      slot.date.toISOString().split('T')[0] === date &&
      slot.startTime === startTime
    );
    if (slotExists) return res.status(400).json({ message: 'Slot already exists' });

    property.availableSlots.push({ date, startTime, endTime, isBooked: false });
    await property.save();

    res.status(201).json({ message: 'Slot added successfully', slot: { date, startTime, endTime } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New endpoint: Update an existing slot (only if not booked)
exports.updatePropertySlot = async (req, res) => {
  try {
    const { propertyId, slotId } = req.params;
    const { date, startTime, endTime } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const slot = property.availableSlots.id(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ message: 'Cannot update booked slot' });

    slot.date = date || slot.date;
    slot.startTime = startTime || slot.startTime;
    slot.endTime = endTime || slot.endTime;

    await property.save();
    res.json({ message: 'Slot updated successfully', slot });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New endpoint: Remove a slot (only if not booked)
exports.removePropertySlot = async (req, res) => {
  try {
    const { propertyId, slotId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    const slot = property.availableSlots.id(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.isBooked) return res.status(400).json({ message: 'Cannot remove booked slot' });

    property.availableSlots.pull(slotId);
    await property.save();

    res.json({ message: 'Slot removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// New endpoint: Cancel a confirmed booking by seller
exports.cancelConfirmedBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('property')
      .populate('user');
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ message: 'Can only cancel confirmed bookings' });
    }

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

    // Send email to user
    const html = compileTemplate('bookingCancelled', {
      userName: booking.user.name,
      propertyTitle: booking.property.title,
      date: booking.date.toLocaleDateString(),
      startTime: booking.startTime
    });

    await transporter.sendMail({
      from: 'ddmalalagama@gmail.com',
      to: booking.user.email,
      subject: 'Booking Cancelled by Seller',
      html
    });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};