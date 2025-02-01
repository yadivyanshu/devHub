const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { sendResetEmail } = require('../utils/emailService');
const crypto = require('crypto');

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
        res.status(200).json({
            message: "Logged in successfully",
            user
        });
    } catch(err) {
        res.status(400).send("Error while logging in: " + err.message);
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.send("Logged out successfully");
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("User with this email does not exist");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = await bcrypt.hash(resetToken, 10);
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendResetEmail(user.email, resetToken);

        res.json({ message: "Password reset link sent to email." });
    } catch (err) {
        res.status(500).send("Error sending reset email: " + err.message);
    }
});


router.post('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({ resetPasswordExpires: { $gt: Date.now() } });
        if (!user || !(await bcrypt.compare(token, user.resetPasswordToken))) {
            return res.status(400).send("Invalid or expired reset token");
        }

        user.password = await bcrypt.hash(newPassword, 8);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send("Password reset successful. You can now log in.");
    } catch (err) {
        res.status(500).send("Error resetting password: " + err.message);
    }
});


module.exports = router;