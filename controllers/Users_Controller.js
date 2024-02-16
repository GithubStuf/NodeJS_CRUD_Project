const bcrypt = require('bcrypt');
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

//Load Users
function Load (message, type, res) {
    User.find().exec()
    .then((users) => {
        res.render('index', {
            title: 'Admin Page',
            users: users,
            type: type,
            message: message
    
        });
    })
    .catch((err) => {
        res.json({
            message: err.message
        });
    });
} 

const getUsers = async (req, res) => {
    Load(``, 'success', res);
};
const addUser =  async (req, res, next) => {
    try {
        const {
            name,
            email,
            pass
        } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(pass, salt);
        
        const user = new User({
            name: name,
            email:email,
            password: hashedPassword,
            image: req.file.filename,
        });

        await user.save();

        req.session.message = {
            type: 'success',
            message: 'User added successfully'
        };
        res.redirect("/");
    } catch (error) {
        req.session.message = {
            type: 'danger',
            message: error.message
        };
        res.redirect("/signin");
    }
};
const editUser = async (req, res) => {
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
        res.redirect('/edit_users');
    });
};
const updateUser = async (req, res) => {
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
        password : req.body.password,
        image : new_image,
    })
    .then((result) => {
        Load(`User update successfully`, 'success', res);
    }).catch((err) => {
        res.json({ message: err.message, type: 'danger'});
    });
}
const deleteUser = async(req, res) => {
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
        res.redirect('/index');
    })
    .catch((err) =>{
        res.json({
            message: err.message
        });
    });
}

module.exports = {
    getUsers, 
    addUser, 
    editUser, 
    updateUser, 
    deleteUser,
    upload,
};