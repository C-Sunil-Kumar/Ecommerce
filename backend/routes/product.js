const express = require('express');
const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createProductReview} = require('../controllers/productController');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

router.get('/products', isAuthenticatedUser, getProducts);
router.post('/product/new',isAuthenticatedUser,authorizeRoles('admin'), newProduct);
router.route('/product/:id')
    .get(getSingleProduct)
    .put(updateProduct)
    .delete(deleteProduct);
router.route('/reviews').put(isAuthenticatedUser, createProductReview);



module.exports = router;
