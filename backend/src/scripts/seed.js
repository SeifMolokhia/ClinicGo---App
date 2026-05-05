// ============================================================
// Seed script — populates the database with sample data
// Run with: npm run seed
// Creates 12 doctors + 1 admin user + 1 demo patient
// ============================================================

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const doctors = [
  {
    name: 'Dr. Ahmed El-Sayed', specialty: 'Cardiologist', rating: 4.9, reviews: 312,
    location: 'Maadi, Cairo', fee: 350, nextSlot: 'Today, 3:00 PM', verified: true,
    image: 'https://randomuser.me/api/portraits/men/32.jpg', experience: 15,
    languages: ['Arabic', 'English'],
    about: 'Highly experienced cardiologist with over 15 years in cardiovascular medicine. Specialises in heart failure, coronary artery disease, and preventive cardiology.',
    availability: ['Sun', 'Mon', 'Tue', 'Thu'],
    timeSlots: ['9:00 AM', '9:30 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:30 PM'],
  },
  {
    name: 'Dr. Sara Mansour', specialty: 'Dermatologist', rating: 4.8, reviews: 256,
    location: 'Zamalek, Cairo', fee: 400, nextSlot: 'Today, 5:00 PM', verified: true,
    image: 'https://randomuser.me/api/portraits/women/44.jpg', experience: 10,
    languages: ['Arabic', 'English', 'French'],
    about: 'Renowned dermatologist specialising in cosmetic dermatology, acne treatment, and skin cancer screening.',
    availability: ['Mon', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '2:30 PM', '4:00 PM', '5:00 PM'],
  },
  {
    name: 'Dr. Khaled Ibrahim', specialty: 'Pediatrician', rating: 4.9, reviews: 489,
    location: 'Heliopolis, Cairo', fee: 250, nextSlot: 'Tomorrow, 10:00 AM', verified: true,
    image: 'https://randomuser.me/api/portraits/men/45.jpg', experience: 18,
    languages: ['Arabic', 'English'],
    about: 'Beloved pediatrician with 18 years of experience caring for children from newborns to adolescents.',
    availability: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'],
    timeSlots: ['8:00 AM', '8:30 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'],
  },
  {
    name: 'Dr. Nadia Farouk', specialty: 'Gynecologist', rating: 4.7, reviews: 203,
    location: 'Smouha, Alexandria', fee: 300, nextSlot: 'Today, 2:00 PM', verified: true,
    image: 'https://randomuser.me/api/portraits/women/68.jpg', experience: 12,
    languages: ['Arabic', 'English'],
    about: "Dedicated gynecologist specialising in women's health, maternal care, and minimally invasive surgery.",
    availability: ['Mon', 'Tue', 'Thu', 'Sat'],
    timeSlots: ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM'],
  },
  {
    name: 'Dr. Tarek Hassan', specialty: 'Orthopedic', rating: 4.8, reviews: 178,
    location: 'Mohandessin, Cairo', fee: 450, nextSlot: 'Tomorrow, 11:00 AM', verified: false,
    image: 'https://randomuser.me/api/portraits/men/22.jpg', experience: 20,
    languages: ['Arabic', 'English'],
    about: 'Orthopedic surgeon with expertise in joint replacement, sports injuries, and spinal disorders.',
    availability: ['Sun', 'Wed', 'Thu'],
    timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '3:00 PM', '4:00 PM'],
  },
  {
    name: 'Dr. Layla Mostafa', specialty: 'Neurologist', rating: 4.9, reviews: 267,
    location: 'Gleem, Alexandria', fee: 500, nextSlot: 'Today, 6:00 PM', verified: true,
    image: 'https://randomuser.me/api/portraits/women/26.jpg', experience: 14,
    languages: ['Arabic', 'English', 'German'],
    about: 'Distinguished neurologist specialising in epilepsy, migraines, and neurodegenerative diseases.',
    availability: ['Mon', 'Tue', 'Thu', 'Fri'],
    timeSlots: ['11:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'],
  },
  {
    name: 'Dr. Omar Galal', specialty: 'ENT', rating: 4.6, reviews: 134,
    location: 'Nasr City, Cairo', fee: 280, nextSlot: 'Tomorrow, 9:00 AM', verified: true,
    image: 'https://randomuser.me/api/portraits/men/36.jpg', experience: 9,
    languages: ['Arabic', 'English'],
    about: 'ENT specialist with expertise in sinusitis, hearing loss, and throat conditions.',
    availability: ['Sun', 'Mon', 'Wed', 'Thu'],
    timeSlots: ['9:00 AM', '9:30 AM', '10:00 AM', '11:30 AM', '2:00 PM', '3:00 PM'],
  },
  {
    name: 'Dr. Rana Soliman', specialty: 'Ophthalmologist', rating: 4.8, reviews: 198,
    location: 'Dokki, Cairo', fee: 350, nextSlot: 'Today, 4:00 PM', verified: true,
    image: 'https://randomuser.me/api/portraits/women/12.jpg', experience: 11,
    languages: ['Arabic', 'English'],
    about: 'Skilled ophthalmologist specialising in cataract surgery, refractive errors, and glaucoma management.',
    availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'],
  },
  {
    name: 'Dr. Hossam Nabil', specialty: 'Cardiologist', rating: 4.7, reviews: 145,
    location: 'New Cairo, Cairo', fee: 400, nextSlot: 'Tomorrow, 2:00 PM', verified: false,
    image: 'https://randomuser.me/api/portraits/men/55.jpg', experience: 13,
    languages: ['Arabic', 'English'],
    about: 'Cardiologist focused on interventional cardiology and echocardiography.',
    availability: ['Tue', 'Thu', 'Sat'],
    timeSlots: ['9:00 AM', '10:00 AM', '11:30 AM', '2:00 PM', '3:00 PM'],
  },
  {
    name: 'Dr. Yasmin Kamal', specialty: 'Dermatologist', rating: 4.9, reviews: 321,
    location: 'Stanley, Alexandria', fee: 380, nextSlot: 'Today, 7:00 PM', verified: true,
    image: 'https://randomuser.me/api/portraits/women/55.jpg', experience: 8,
    languages: ['Arabic', 'English', 'French'],
    about: 'Specialises in laser treatments, anti-aging procedures, and chronic skin conditions.',
    availability: ['Sun', 'Mon', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['12:00 PM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM', '7:00 PM'],
  },
  {
    name: 'Dr. Amr Zaki', specialty: 'Orthopedic', rating: 4.6, reviews: 167,
    location: 'Smouha, Alexandria', fee: 420, nextSlot: 'Tomorrow, 1:00 PM', verified: true,
    image: 'https://randomuser.me/api/portraits/men/67.jpg', experience: 16,
    languages: ['Arabic', 'English'],
    about: 'Specialises in sports medicine and arthroscopic surgery.',
    availability: ['Mon', 'Wed', 'Sat'],
    timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '3:00 PM'],
  },
  {
    name: 'Dr. Mona Abdallah', specialty: 'Pediatrician', rating: 4.8, reviews: 412,
    location: 'Heliopolis, Cairo', fee: 220, nextSlot: 'Today, 5:30 PM', verified: true,
    image: 'https://randomuser.me/api/portraits/women/82.jpg', experience: 20,
    languages: ['Arabic', 'English'],
    about: 'Senior pediatrician with two decades of experience. Passionate about early childhood development.',
    availability: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Sat'],
    timeSlots: ['9:00 AM', '10:00 AM', '11:00 AM', '3:00 PM', '4:30 PM', '5:30 PM'],
  },
];

const seedUsers = [
  {
    name:     'Admin User',
    email:    'admin@clinicgo.com',
    password: 'admin123',
    role:     'admin',
  },
  {
    name:     'Test Patient',
    email:    'patient@clinicgo.com',
    password: 'patient123',
    role:     'patient',
    mobile:   '01012345678',
  },
];

const run = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database…');

    // Clear existing data
    await Promise.all([
      Doctor.deleteMany({}),
      User.deleteMany({}),
      Appointment.deleteMany({}),
    ]);
    console.log('   Cleared existing collections');

    // Insert
    const insertedDoctors = await Doctor.insertMany(doctors);
    console.log(`   Inserted ${insertedDoctors.length} doctors`);

    // Users created one by one so the password-hashing pre-save hook fires
    for (const u of seedUsers) {
      await User.create(u);
    }
    console.log(`   Inserted ${seedUsers.length} users`);

    console.log('\n✅ Seed complete!');
    console.log('   Admin login:   admin@clinicgo.com   / admin123');
    console.log('   Patient login: patient@clinicgo.com / patient123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

run();
