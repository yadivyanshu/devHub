const express = require('express');
const connectDB = require('./config/database');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { userAuth } = require('./middlewares/auth');


const app = express();

app.use(express.json());
app.use(cookieParser());

app.post('/signup', async (req, res) => {
    try {
        const existedUser = await User.find({ email: req.body.email });
        if(existedUser.length > 0) {
            return res.status(400).send("Email already exists");
        }

        const {firstName, lastName, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await user.save();
        res.send("User created successfully");
    }catch(err) {
        res.status(400).send("Error while creating user " + err.message);
    }
});

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if(!user) {
            throw new Error("Invalid credentials");
        }

        const isPasswordMatched = await user.validatePassword(password);
        if(!isPasswordMatched) {
            throw new Error("Invalid credentials");
        }
        
        const token = await user.getJwt();
        res.cookie('token', token, {expires: new Date(Date.now() + 86400000)});
        res.send("Logged in successfully");
    } catch(err) {
        res.status(400).send("Error while logging in: " + err.message);
    }
});

app.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(400).send("Error while getting profile: " + err.message);
    }
});


app.patch('/users/:userId', async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = ['photoUrl', 'gender', 'age', 'about', 'skills'];
        const isUpdatedAllowed = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update));
        if(!isUpdatedAllowed) {
            return res.status(400).send("Invalid updates");
        }

        const updatedUser = await User.findByIdAndUpdate(userId, data, {returnDocument: 'after', runValidators: true});
        res.send(updatedUser);
    }catch(err) {
        res.status(400).send("Error while updating user " + err.message);
    }
});


connectDB()
    .then(() => {
        console.log('Database connected');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.log(err);
    });