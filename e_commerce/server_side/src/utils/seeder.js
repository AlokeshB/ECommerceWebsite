require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

// Admin user data
const ADMIN_USER = {
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123",
  role: "admin",
  isActive: true,
  isEmailVerified: true,
};

const seedDatabase = async () => {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("\n📝 Seeding admin user only...");
    console.log("Note: All products will be added through the admin form!\n");

    let adminUser;
    try {
      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: ADMIN_USER.email });
      if (existingAdmin) {
        console.log(`⚠ Admin user already exists: ${ADMIN_USER.email}`);
        adminUser = existingAdmin;
      } else {
        adminUser = await User.create(ADMIN_USER);
        console.log(`✓ Admin user created: ${adminUser.email}`);
      }
    } catch (error) {
      console.error("✗ Error creating admin user:", error.message);
      throw error;
    }

    console.log("\n✓ Database seeding completed successfully!\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("  ADMIN CREDENTIALS");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`  Email:    ${ADMIN_USER.email}`);
    console.log(`  Password: ${ADMIN_USER.password}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log("✓ Login with these credentials in the application");
    console.log("✓ Use the admin dashboard to add products through the form\n");

    process.exit(0);
  } catch (error) {
    console.error("\n✗ Error seeding database:", error.message);
    if (error.errors) {
      Object.keys(error.errors).forEach((key) => {
        console.error(`  - ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
