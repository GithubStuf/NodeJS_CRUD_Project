const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const multer = require('multer');
const fs = require('fs');


//image upload
var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, "./uploads");
    },
    filename: function (req, file, cb){
        cb(null, file.filename + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer ({
    storage:storage,
}).single("image");

//Insert User into database route
router.post('/add', upload, (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone ,
        image: req.file.filename,
    });
    user.save()
    .then((res, req) =>{
        res.json({
            message: err.message, type: 'danger'
        });
    }).catch((err)=>{
        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        res.redirect("/");
    });
});

// Get All Users route
router.get("/", (req, res) => {
    User.find().exec()
        .then((users) => {
            res.render('index', {
                title: 'Home Page',
                users: users,
            });
        })
        .catch((err) => {
            res.json({
                message: err.message
            });
        });
});



router.get("/add", (req, res) => {
    res.render('add_users', {title: 'Add Users'});
})

// Edit user
router.get('/edit/:id', (req, res) => {
    let id = req.params.id;
    User.findById(id)
    .then( (user) => {
        if (user == null) {
            res.redirect('/');
        } else {
            res.render('edit_users', {
                title: "Edit User",
                user: user,
            });
        }
    })
    .catch((err) => {
        res.redirect('/');
    });
});

//Update user
router.post('/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if(req.file){
        new_image = req.file.filename;
        try{
            fs.unlinkSync('./uploads/'+req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else{
        new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
        name : req.body.name,
        email : req.body.email,
        phone : req.body.phone,
        image : new_image,
    })
    .then((result) => {
        req.session.message = {
            type: "success",
            message: "User update successfully!",
        };
        res.redirect('/')
    }).catch((err) => {
        res.json({ message: err.message, type: 'danger'});
    });
});

//Delete user
router.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    User.findByIdAndDelete(id)
    .then ((result) => {
        if(result.image != ''){
            try{
                fs.unlinkSync('./uploads/' + result.image);
            }catch(err){
                console.log(err)
            }
        };
        req.session.message = {
            type: 'info',
            message: 'User deleted successfully'
        };
        res.redirect('/');
    })
    .catch((err) =>{
        res.json({
            message: err.message
        });
    });
});



module.exports = router;