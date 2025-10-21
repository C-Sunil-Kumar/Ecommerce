const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        const con = await mongoose.connect(process.env.DB_LOCAL_URI);
        console.log(`MongoDB connected with host: ${con.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        console.log('Shutting down the server due to database connection failure');
        process.exit(1); // Exit process with failure
    }
}

module.exports = connectDatabase;