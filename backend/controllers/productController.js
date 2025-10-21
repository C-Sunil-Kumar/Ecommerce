const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');

// get all product - /api/v1/products
exports.getProducts = async (req, res, next) => {
    const resultPerPage = 2;
    const apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().paginate(resultPerPage);
    // const products = await Product.find();
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
}

// get single product - /api/v1/product/:id

exports.getSingleProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product
    })
}

// create a new product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id; // req.user is from authenticate middleware
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
})

// update product - /api/v1/product/:id

exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        product
    });
}

// delete product - /api/v1/product/:id

exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
}

// create new review or update the review - /api/v1/review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }
    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    const existingReview = product.reviews.find(
        (r) => r.user && r.user.toString() === req.user.id // Check if r.user exists before calling toString(), and use req.user.id directly
    );

    if (existingReview) {
        // If review exists, update it directly without looping again
        existingReview.comment = comment;
        existingReview.rating = rating;
    } else {
        // If review doesn't exist, add it
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Recalculate the average product rating
    // If there are no reviews, the rating should be 0, otherwise calculate the average.
    if (product.reviews.length > 0) {
        const avgRating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        product.ratings = Math.round(avgRating * 10) / 10; // Round to one decimal place
    } else {
        product.ratings = 0;
    }
    // Save the changes to the database
    await product.save({ validateBeforeSave: false });

    // Send a success response
    res.status(200).json({
        success: true,
        message: 'Review added/updated successfully'
    });
});
