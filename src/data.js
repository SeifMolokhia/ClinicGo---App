// ============================================================
// ClinicGo — Static UI options
// Dropdown values for the Search filters and the Home page
// specialty cards. Doctor records themselves come from the
// backend (/api/doctors).
// ============================================================

window.SPECIALTY_OPTIONS = [
  'All Specialties',
  'Cardiologist',
  'Dermatologist',
  'Pediatrician',
  'Orthopedic',
  'Neurologist',
  'Gynecologist',
  'ENT',
  'Ophthalmologist',
];

window.LOCATION_OPTIONS = [
  'All Locations',
  'Cairo',
  'Alexandria',
  'Maadi, Cairo',
  'Zamalek, Cairo',
  'Heliopolis, Cairo',
  'Nasr City, Cairo',
  'Mohandessin, Cairo',
  'New Cairo, Cairo',
  'Dokki, Cairo',
  'Smouha, Alexandria',
  'Gleem, Alexandria',
  'Stanley, Alexandria',
];

// Maps specialty card names on the Home page → backend specialty labels
window.SPECIALTY_MAP = {
  'Cardiology':    'Cardiologist',
  'Dermatology':   'Dermatologist',
  'Pediatrics':    'Pediatrician',
  'Orthopedics':   'Orthopedic',
  'Neurology':     'Neurologist',
  'Gynecology':    'Gynecologist',
  'ENT':           'ENT',
  'Ophthalmology': 'Ophthalmologist',
};
