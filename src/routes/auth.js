const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

router.post('/signup', async (req, res) => {
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

router.post('/login', async (req, res) => {
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

module.exports = router;