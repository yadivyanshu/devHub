const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');

router.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(400).send("Error while getting profile: " + err.message);
    }
});

module.exports = router;