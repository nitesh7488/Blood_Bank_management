const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    // Updated connection with proper options
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      // Remove any write concern from here unless specifically needed
    });

    console.log(
      `Connected To MongoDB Database ${mongoose.connection.host}`.bgMagenta.white
    );

    // Verify connection status
    mongoose.connection.on('error', err => {
      console.error(`MongoDB connection error: ${err}`.bgRed.white);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected'.bgYellow.white);
    });

  } catch (error) {
    console.error(`MongoDB Database Error ${error}`.bgRed.white);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;