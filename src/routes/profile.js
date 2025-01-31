const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const {validateEditProfileData} = require('../utils/validation');

router.get('/profile/view', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(400).send("Error while getting profile: " + err.message);
    }
});

router.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid updates");
        }

        const loggedInUser = req.user;
        const requestedUpdates = req.body;
        Object.keys(requestedUpdates).forEach((update) => loggedInUser[update] = requestedUpdates[update]);
        await loggedInUser.save();
        res.json({message: `${loggedInUser.firstName}, your profile is updated successfully!`, data: loggedInUser});
    } catch(err) {
        res.status(400).send("Error while updating profile: " + err.message);
    }
});

module.exports = router;