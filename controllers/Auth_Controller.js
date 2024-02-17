const bcrypt = require('bcrypt');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Check if req.session.user is not set
    if (!req.session.user) {
        // If not set, redirect to the signin page
        return res.redirect('/signin');
    }

    // If req.session.user is set, continue to the next middleware
    next();
};
const logout = (req,res) => {
    req.session.destroy(
        function(err){
            if(err){
                req.session.message = {
                    type: 'danger',
                    message: err.message
                };
                res.redirect("/index");
            }else{
                res.render('HomePage',{
                    title: 'Home Page',
                    type: 'info',
                    message: 'Logout'
                })
            }
        }
    );
}

const authUser = async (req, res, next) => {
    try {
        const {email, pass } =req.body;
              const user = await User.findOne({ email });
              if (!user) {
                req.session.message = {
                    type: 'danger',
                    message: 'User not found'
                };
                res.redirect('/signin');
              }
              bcrypt.compare(pass, user.password, (err, result) => {
                if (result) {
                    // password is valid
                    req.session.user = user;
                    User.find().exec()
                    .then((users) => {
                        res.render('index', {
                            title: 'Admin Page',
                            users: users,
                            type: 'info',
                            message:`${user.name}`,
                            
                        });
                          const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
                            expiresIn: '1d'
                          });
                          res.json({ token });
                    })
                    .catch((err) => {
                        res.json({
                            message: err.message
                        });
                    });
                }else{
                    req.session.message = {
                        type: 'danger',
                        message: 'Password Incorrect'
                    };
                    res.redirect('/signin');
                }
            });


    } catch (error) {
      next(error);
    }
}


module.exports = { authUser, authMiddleware, logout };