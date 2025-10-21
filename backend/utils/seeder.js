const products = require('../data/product.json');
const Product = require('../models/productModel');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('../config/database');

dotenv.config({ path: path.join(__dirname, '../config/config.env') });

const seedProducts = async () => {
    try {
        await Product.deleteMany({});
        console.log('all products are deleted')
        await Product.insertMany(products);
        console.log('all products are seeded')

    } catch (error) {
        console.log(error.message);
    }
    process.exit();
}

connectDatabase();
seedProducts();