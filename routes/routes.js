const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/Users');





// HomePage route
router.get("/", (req, res) => {
    if(!req.session.user){
        res.render('HomePage', {
            title: 'Home Page',
        });
    }else{
        res.redirect('/index');
    }
});

router.get("/add", (req, res) => {
    res.render('add_users', {title: 'Add Users'});
})

const UserController = require('../controllers/Users_Controller');
const AuthController = require('../controllers/Auth_Controller');

// Get All Users route
router.get("/index",AuthController.authMiddleware, UserController.getUsers);

//Insert User into database route
router.post('/add',UserController.upload, UserController.addUser);

// Edit user
router.get('/edit/:id', UserController.editUser);

//Update user
router.post('/update/:id',UserController.upload, UserController.updateUser);

//Delete user
router.get('/delete/:id', UserController.deleteUser);


//Signin route
router.get('/signin', (req, res) => {
    res.render('Sign_in', {
        title: 'Login Page'
    });
})

//Signup route
router.get('/signup', (req, res) => {
    res.render('Sign_up', {
        title: 'Registration Page'
    });
})


//Authentification route
router.post('/auth_user', AuthController.authUser);

//Logout
router.get('/logout', AuthController.logout);




module.exports = router;