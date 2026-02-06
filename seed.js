const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Brand = require('./models/brand');
const Perfume = require('./models/perfume');
const Member = require('./models/member');

const brands = [
  { brandName: 'Chanel' },
  { brandName: 'Dior' },
  { brandName: 'Tom Ford' },
  { brandName: 'Gucci' },
  { brandName: 'Versace' },
];

const perfumes = [
  {
    perfumeName: 'Chanel No. 5',
    uri: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    price: 150,
    concentration: 'Extrait',
    description: 'A timeless classic fragrance with floral notes',
    ingredients: 'Rose, Jasmine, Ylang-Ylang, Vanilla',
    volume: 50,
    targetAudience: 'female',
    brandName: 'Chanel',
  },
  {
    perfumeName: 'Sauvage',
    uri: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400',
    price: 120,
    concentration: 'EDP',
    description: 'Fresh and spicy fragrance for the modern man',
    ingredients: 'Bergamot, Pepper, Ambroxan, Vanilla',
    volume: 100,
    targetAudience: 'male',
    brandName: 'Dior',
  },
  {
    perfumeName: 'Black Orchid',
    uri: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400',
    price: 180,
    concentration: 'EDP',
    description: 'Luxurious and sensual dark fragrance',
    ingredients: 'Black Orchid, Spices, Dark Chocolate, Patchouli',
    volume: 50,
    targetAudience: 'unisex',
    brandName: 'Tom Ford',
  },
  {
    perfumeName: 'Guilty Pour Homme',
    uri: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=400',
    price: 95,
    concentration: 'EDT',
    description: 'Bold and aromatic fragrance',
    ingredients: 'Lemon, Lavender, Orange Blossom, Patchouli',
    volume: 90,
    targetAudience: 'male',
    brandName: 'Gucci',
  },
  {
    perfumeName: 'Eros',
    uri: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
    price: 110,
    concentration: 'EDT',
    description: 'Fresh, woody, and slightly oriental',
    ingredients: 'Mint, Lemon, Tonka Bean, Vanilla',
    volume: 100,
    targetAudience: 'male',
    brandName: 'Versace',
  },
  {
    perfumeName: 'Miss Dior',
    uri: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=400',
    price: 135,
    concentration: 'Extrait',
    description: 'Elegant floral fragrance',
    ingredients: 'Rose, Peony, Iris, Musk',
    volume: 50,
    targetAudience: 'female',
    brandName: 'Dior',
  },
];

const members = [
  {
    membername: 'Admin User',
    email: 'admin@perfume.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    membername: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
  },
  {
    membername: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Brand.deleteMany({});
    await Perfume.deleteMany({});
    await Member.deleteMany({});
    console.log('Cleared existing data');

    // Create brands
    const createdBrands = await Brand.insertMany(brands);
    console.log(`Created ${createdBrands.length} brands`);

    // Create brand map for lookup
    const brandMap = {};
    createdBrands.forEach(brand => {
      brandMap[brand.brandName] = brand._id;
    });

    // Create perfumes with brand references
    const perfumesWithBrands = perfumes.map(perfume => ({
      ...perfume,
      brand: brandMap[perfume.brandName],
      comments: [],
    }));
    delete perfumesWithBrands.forEach(p => delete p.brandName); // Remove temporary field

    const createdPerfumes = await Perfume.insertMany(perfumesWithBrands);
    console.log(`Created ${createdPerfumes.length} perfumes`);

    // Create members with hashed passwords
    const membersWithHashedPasswords = await Promise.all(
      members.map(async member => ({
        ...member,
        password: await bcrypt.hash(member.password, 10),
      }))
    );

    const createdMembers = await Member.insertMany(membersWithHashedPasswords);
    console.log(`Created ${createdMembers.length} members`);

    // Add some sample comments
    const sampleComments = [
      {
        perfumeId: createdPerfumes[0]._id,
        rating: 5,
        content: 'Absolutely love this perfume! Classic and elegant.',
        authorId: createdMembers[1]._id,
      },
      {
        perfumeId: createdPerfumes[1]._id,
        rating: 5,
        content: 'Best fragrance for daily wear. Highly recommended!',
        authorId: createdMembers[2]._id,
      },
      {
        perfumeId: createdPerfumes[2]._id,
        rating: 4,
        content: 'Nice scent but a bit too strong for my taste.',
        authorId: createdMembers[1]._id,
      },
    ];

    for (const comment of sampleComments) {
      const perfume = await Perfume.findById(comment.perfumeId);
      perfume.comments.push({
        rating: comment.rating,
        content: comment.content,
        author: comment.authorId,
      });
      await perfume.save();
    }
    console.log('Added sample comments');

    console.log('\n=== Seed Complete ===');
    console.log('\nAdmin Login:');
    console.log('Email: admin@perfume.com');
    console.log('Password: admin123');
    console.log('\nRegular User Login:');
    console.log('Email: john@example.com');
    console.log('Password: password123');
    console.log('\n====================\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
