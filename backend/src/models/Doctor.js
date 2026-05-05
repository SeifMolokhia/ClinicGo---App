// ============================================================
// Doctor model
// Catalog of doctors patients can book. Read-heavy entity;
// indexed on specialty and location for fast filtering.
// ============================================================

const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  specialty: {
    type: String,
    required: [true, 'Specialty is required'],
    enum: [
      'Cardiologist', 'Dermatologist', 'Pediatrician', 'Orthopedic',
      'Neurologist', 'Gynecologist', 'ENT', 'Ophthalmologist',
    ],
    index: true,
  },
  location: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  fee: {
    type: Number,
    required: true,
    min: [0, 'Fee cannot be negative'],
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviews: {
    type: Number,
    min: 0,
    default: 0,
  },
  experience: {
    type: Number,
    min: 0,
    default: 0,
  },
  image: {
    type: String,
    trim: true,
  },
  about: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  languages: [{
    type: String,
    trim: true,
  }],
  availability: [{
    type: String,
    enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  }],
  timeSlots: [{
    type: String,
    trim: true,
  }],
  verified: {
    type: Boolean,
    default: false,
  },
  nextSlot: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

// Compound index to speed up the most common search query
doctorSchema.index({ specialty: 1, location: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
