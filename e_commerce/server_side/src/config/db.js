const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017";
    const dbName = process.env.DB_NAME || "ecommerce";

    console.log(`Connecting to MongoDB: ${mongoURI}/${dbName}`);
    
    const conn = await mongoose.connect(mongoURI, {
      dbName: dbName,
    });

    console.log(`✓ MongoDB Connected: ${conn.connection.host}/${dbName}`);
    return conn;
  } catch (error) {
    console.error(`✗ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
