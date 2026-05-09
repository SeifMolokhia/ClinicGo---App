// ============================================================
// Appointment model
// Join entity between User (patient) and Doctor.
// A unique compound index prevents double-booking the same slot.
// ============================================================

const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['booked', 'cancelled', 'completed'],
    default: 'booked',
    index: true,
  },
  mode: {
    type: String,
    enum: ['in-person', 'teleconsultation'],
    default: 'in-person',
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 500,
  },
}, { timestamps: true });

// Prevent the same doctor from being booked twice in the same slot.
// Only enforced for active (non-cancelled) appointments via partial index.
appointmentSchema.index(
  { doctor: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: 'booked' } }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
