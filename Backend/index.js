// Backend/index.js
import mongoose from "mongoose";
import app from "./app.js";
import dotenv from 'dotenv';

dotenv.config(); // Pastikan variabel lingkungan dimuat

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_interview_db') // Gunakan MONGO_URI dari .env
    .then(() => {
        console.log('Database connected');
        const PORT = process.env.PORT || 5000; // Gunakan PORT dari .env, default 5000
        app.listen(PORT, () => {
            console.log(`Server is running on localhost:${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    })
    .catch((e) => {
        console.error('Error connecting to database: ', e.message);
        process.exit(1); // Keluar jika koneksi database gagal
    });