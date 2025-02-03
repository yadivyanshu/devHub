const express = require('express');
const router = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const sendEmail = require("../utils/sendEmail");

router.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;
        const ALLOWED_STATUSES = ['interested', 'ignored'];
        if(!ALLOWED_STATUSES.includes(status)) {
            throw new Error("Invalid status. Valid statuses are interested, ignored");
        }

        const toUser = await User.findById(toUserId);
        if(!toUser) {
            throw new Error("User not found");
        }

        const isExistingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ]
        });
        if(isExistingConnectionRequest) {
            throw new Error("Connection request already exists");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();

        if(status === 'interested') {
            const emailRes = await sendEmail.run(
                "🔔 Connection Request Notification",
                `<div style="font-family: Arial, sans-serif; color: #333;">
                    <p><strong>${req.user.firstName}</strong> has sent <strong>${toUser.firstName}</strong> a connection request.</p>
                    <p>Stay connected and collaborate with like-minded professionals.</p>
                    <p><a href="https://devhub.work/" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View Request</a></p>
                    <p>If you did not request this, you can ignore this message.</p>
                    <br>
                    <p>Thanks,</p>
                    <p>Your Team at DevHub</p>
                </div>`,
            );
        }

        res.status(201).json({
            message: "Connection request sent successfully",
            data
        });
    } catch(err) {
        res.status(400).send("Error while sending connection request: " + err.message);
    }
});

router.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const requestId = req.params.requestId;
        const status = req.params.status;
        const ALLOWED_STATUSES = ['accepted', 'rejected'];
        if(!ALLOWED_STATUSES.includes(status)) {
            throw new Error("Invalid status. Valid statuses are accepted, rejected");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: 'interested'
        });
        if(!connectionRequest) {
            throw new Error("Connection request not found");
        }
        
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).json({
            message: `Connection request ${status} successfully!`,
            data
        });
    } catch(err) {
        res.status(400).send("Error while reviewing connection request: " + err.message);
    }
});

module.exports = router;