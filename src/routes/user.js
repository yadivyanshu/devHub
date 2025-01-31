const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const router = express.Router();

router.get('/user/requests', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find(
        {
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', 'firstName lastName photoUrl age gender about skills');

        res.status(200).json({
            message: "User requests fetched successfully",
            data: connectionRequests
        });
    } catch(err) {
        res.status(400).send("Error while fetching user requests: " + err.message);
    }
});

module.exports = router;