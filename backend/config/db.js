// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true
//     });
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.error('Error connecting to MongoDB!', error);
//     process.exit(1);
//   }
// };

// export default connectDB;

// backendhrside/db.js
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// dotenv.config();

// // Connect to HR database
// await mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// console.log('✅ Connected to HR database');

// // Create connection to User database
// const userDBConnection = mongoose.createConnection(process.env.USER_MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// userDBConnection.on('connected', () => {
//   console.log('✅ Connected to User database');
// });

// userDBConnection.on('error', (err) => {
//   console.error('❌ User DB connection error:', err);
// });

// export { userDBConnection };

// config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
