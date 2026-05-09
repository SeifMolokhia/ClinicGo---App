// ============================================================
// Appointment controller — book, list-mine, cancel
// All endpoints require authentication.
// ============================================================

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/appointments
// Body: { doctorId, date (ISO string), timeSlot, notes? }
exports.book = asyncHandler(async (req, res) => {
  const { doctorId, date, timeSlot, notes, mode } = req.body;

  if (!doctorId || !date || !timeSlot) {
    return res.status(400).json({ error: 'doctorId, date, and timeSlot are required' });
  }

  // Verify the doctor exists and offers that time slot
  const doctor = await Doctor.findById(doctorId);
  if (!doctor) {
    return res.status(404).json({ error: 'Doctor not found' });
  }
  if (doctor.timeSlots.length && !doctor.timeSlots.includes(timeSlot)) {
    return res.status(400).json({ error: `Doctor does not offer slot "${timeSlot}"` });
  }

  // Don't allow booking past dates
  if (new Date(date) < new Date(Date.now() - 24 * 60 * 60 * 1000)) {
    return res.status(400).json({ error: 'Cannot book an appointment in the past' });
  }

  try {
    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      date,
      timeSlot,
      notes,
      mode,
    });
    // Populate doctor details for the response
    await appointment.populate('doctor', 'name specialty location fee image');
    res.status(201).json({ appointment });
  } catch (err) {
    // Duplicate key from the unique index = slot already taken
    if (err.code === 11000) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }
    throw err;
  }
});

// GET /api/appointments  — list current user's appointments
exports.listMine = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { user: req.user._id };
  if (status) filter.status = status;

  const appointments = await Appointment.find(filter)
    .populate('doctor', 'name specialty location fee image')
    .sort({ date: -1, createdAt: -1 });

  res.json({ appointments, count: appointments.length });
});

// DELETE /api/appointments/:id  — cancel an appointment
// Marks status='cancelled' instead of hard-deleting (audit trail).
exports.cancel = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  // Only the owner (or admin) may cancel
  const isOwner = appointment.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'You can only cancel your own appointments' });
  }

  if (appointment.status === 'cancelled') {
    return res.status(400).json({ error: 'Appointment is already cancelled' });
  }

  appointment.status = 'cancelled';
  await appointment.save();
  res.json({ appointment });
});
