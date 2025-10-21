const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/database');


dotenv.config({ path: path.join(__dirname, 'config/config.env') });
connectDatabase();

const PORT = process.env.PORT || 8000;

let server = app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT} in ${process.env.NODE_ENV} mode`);
});

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection');
    server.close(() => {
        process.exit(1);
    });
});
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Uncaught Exception');
    server.close(() => {
        process.exit(1);
    });
}); 