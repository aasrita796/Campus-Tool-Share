/**
 * Seed Script — Run with: node seed.js
 * Adds sample users and items to the database
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Item = require('./models/Item');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusts';

const sampleUsers = [
  { name: 'Rahul Sharma', email: 'rahul@bits.edu', password: 'password123', location: 'Hyderabad', college: 'BITS Hyderabad' },
  { name: 'Priya Nair', email: 'priya@iith.ac.in', password: 'password123', location: 'Hyderabad', college: 'IIT Hyderabad' },
  { name: 'Arjun Reddy', email: 'arjun@iiit.ac.in', password: 'password123', location: 'Hyderabad', college: 'IIIT Hyderabad' },
];

const sampleItems = (userIds) => [
  {
    name: 'Casio FX-991EX Scientific Calculator',
    category: 'Calculators',
    description: 'Advanced scientific calculator with 552 functions. Perfect for engineering maths, statistics, and chemistry. Includes original case.',
    condition: 'Like New',
    location: 'Hyderabad, Madhapur',
    borrowPrice: 30,
    buyPrice: 700,
    allowBorrow: true,
    allowBuy: true,
    owner: userIds[0],
    images: [],
  },
  {
    name: 'Organic Chemistry Textbook (Morrison Boyd)',
    category: 'Books',
    description: 'Morrison & Boyd Organic Chemistry. Comprehensive coverage with solved problems. Ideal for B.Tech first year.',
    condition: 'Good',
    location: 'Hyderabad, Gachibowli',
    borrowPrice: 20,
    buyPrice: 350,
    allowBorrow: true,
    allowBuy: true,
    owner: userIds[1],
    images: [],
  },
  {
    name: 'Arduino Uno Starter Kit',
    category: 'Electronics',
    description: 'Complete starter kit with Arduino Uno R3, 30+ components, breadboard, jumper wires, LEDs, sensors. Great for IoT projects.',
    condition: 'New',
    location: 'Hyderabad, Kondapur',
    borrowPrice: 60,
    buyPrice: 1200,
    allowBorrow: true,
    allowBuy: true,
    owner: userIds[2],
    images: [],
  },
  {
    name: 'Digital Vernier Caliper',
    category: 'Engineering Tools',
    description: 'Stainless steel digital vernier caliper, 0-150mm range, 0.01mm resolution. Ideal for mechanical engineering labs.',
    condition: 'Good',
    location: 'Hyderabad, Jubilee Hills',
    borrowPrice: 25,
    buyPrice: 400,
    allowBorrow: true,
    allowBuy: false,
    owner: userIds[0],
    images: [],
  },
  {
    name: 'Raspberry Pi 4 (4GB)',
    category: 'Gadgets',
    description: 'Raspberry Pi 4 Model B, 4GB RAM. Includes power supply and heat sink. Great for ML projects and IoT prototyping.',
    condition: 'Like New',
    location: 'Hyderabad, Begumpet',
    borrowPrice: 80,
    buyPrice: 3500,
    allowBorrow: true,
    allowBuy: true,
    owner: userIds[1],
    images: [],
  },
  {
    name: 'Chemistry Lab Kit (Semester 1)',
    category: 'Lab Kits',
    description: 'Full semester 1 chemistry lab kit. Includes test tubes, beakers, pipettes, safety goggles, and reagents guide.',
    condition: 'Good',
    location: 'Hyderabad, Kukatpally',
    borrowPrice: 50,
    buyPrice: 800,
    allowBorrow: true,
    allowBuy: true,
    owner: userIds[2],
    images: [],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Item.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async u => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    );
    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`👥 Created ${createdUsers.length} users`);

    // Create items
    const userIds = createdUsers.map(u => u._id);
    const items = sampleItems(userIds);
    const createdItems = await Item.insertMany(items);
    console.log(`📦 Created ${createdItems.length} items`);

    console.log('\n✨ Seed complete! Login credentials:');
    sampleUsers.forEach(u => console.log(`   ${u.email} / password123`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seed();
