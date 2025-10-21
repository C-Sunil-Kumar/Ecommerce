// create new order => /api/v1/order/new
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const sendEmail = require('../utils/email');

//Create new Order--> /api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,

    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user: req.user._id,
    });

    await sendEmail({
        email: req.user.email,
        subject: 'Order Confirmation',
        message: `Hi ${req.user.name},\n\nThank you for your order!\n\nYour order with ID: ${order._id} has been placed successfully and is being processed.\n\nWe will notify you again once your order has been shipped.\n\nThank you for shopping with us!\n\n- Ecommerce Team`
    });

    res.status(201).json({
        success: true,
        order
    });
});

//Get Single Order => /api/v1/order/:id

exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
        return next(new ErrorHandler(`No order found with this ID: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        order
    });
});

//Get logged in user  Orders => /api/v1/myOrders
exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        count: orders.length,
        orders
    })
});

//Admin: Get all Orders => /api/v1/admin/orders
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({});
    let totalAmount = 0;

    orders.forEach(orders => {
        totalAmount = totalAmount + orders.totalPrice;
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// ADMIN: update order - /api/v1/admin/order/:id
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(`No order found with this ID: ${req.params.id}`, 404));
    }

    if (order.orderStatus === 'delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400));
    }

    order.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity);
    });
    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        order
    });

});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}
// delete Order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler(`No order found with this ID: ${req.params.id}`, 404));
    }
    await order.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Order Deleted Successfully'
    });
}); 
