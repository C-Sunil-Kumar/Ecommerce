const express = require('express');
const { registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateUserProfile,
    getAllUsers,
    getSingleUser,
    deleteUser,
    updateUser
} = require('../controllers/authControllers');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const router = express.Router();


//router.post('/register', registerUser);-- below is same functionality just different syntax
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/password/change').post(isAuthenticatedUser, changePassword);
router.route('/myProfile').put(isAuthenticatedUser, getUserProfile);
router.route('/myProfile/update').put(isAuthenticatedUser, updateUserProfile);

//Admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id')
                               .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
                               .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
                               .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router; 