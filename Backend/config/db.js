// backend/config/db.js
const mongoose = require('mongoose'); // Menggunakan require karena ini adalah file konfigurasi yang mungkin di-load pertama kali
require('dotenv').config(); // Untuk memuat variabel lingkungan dari file .env

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Keluar dengan kode status 1 (menandakan kegagalan)
    }
};

module.exports = connectDB; // Mengekspor fungsi connectDB