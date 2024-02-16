//Imports
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const User = require('./models/Users');

const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.DB_URI,{
    });
      console.log(`Server started at http://localhost:${PORT}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(session({
    secret: process.env.SECRET_KEY || 'my_secret_key',
    saveUninitialized: true,
    resave: true,
}));

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static('uploads'));
app.use(express.static('public'));
app.use(express.static('views/styles'));

//Set Template Engine
app.set('view engine', 'ejs');

//Routes
app.use("/", require('./routes/routes'));

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    })
})
