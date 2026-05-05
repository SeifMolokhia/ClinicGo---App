// ============================================================
// Doctor controller — list, get-by-id, create, update, delete
// Read endpoints are public; write endpoints require admin.
// ============================================================

const Doctor = require('../models/Doctor');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/doctors
// Query params: ?q=&specialty=&location=&sort=&page=&limit=
exports.list = asyncHandler(async (req, res) => {
  const { q, specialty, location, sort = 'rating' } = req.query;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));

  const filter = {};

  if (q) {
    // Search by name (case-insensitive)
    filter.name = { $regex: q, $options: 'i' };
  }
  if (specialty && specialty !== 'All Specialties') {
    filter.specialty = specialty;
  }
  if (location && location !== 'All Locations') {
    // Match exact city or "Area, City"
    filter.location = location.includes(',')
      ? location
      : { $regex: new RegExp(`,\\s*${location}$`) };
  }

  const sortMap = {
    rating:     { rating: -1 },
    'fee-low':  { fee: 1 },
    'fee-high': { fee: -1 },
    experience: { experience: -1 },
  };
  const sortBy = sortMap[sort] || sortMap.rating;

  const [doctors, total] = await Promise.all([
    Doctor.find(filter).sort(sortBy).skip((page - 1) * limit).limit(limit),
    Doctor.countDocuments(filter),
  ]);

  res.json({
    doctors,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// GET /api/doctors/:id
exports.getById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ doctor });
});

// POST /api/doctors  (admin)
exports.create = asyncHandler(async (req, res) => {
  const doctor = await Doctor.create(req.body);
  res.status(201).json({ doctor });
});

// PUT /api/doctors/:id  (admin)
exports.update = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ doctor });
});

// DELETE /api/doctors/:id  (admin)
exports.remove = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findByIdAndDelete(req.params.id);
  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
  res.json({ message: 'Doctor deleted', id: doctor._id });
});
