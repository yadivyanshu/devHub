const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const router = express.Router();

const USER_SAFE_FIELDS = 'firstName lastName photoUrl age gender about skills';

router.get('/user/requests', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find(
        {
            toUserId: loggedInUser._id,
            status: 'interested'
        }).populate('fromUserId', USER_SAFE_FIELDS);

        res.status(200).json({
            message: "User requests fetched successfully",
            data: connectionRequests
        });
    } catch(err) {
        res.status(400).send("Error while fetching user requests: " + err.message);
    }
});

router.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find(
        {
            $or: [
                {fromUserId: loggedInUser._id, status: 'accepted'},
                {toUserId: loggedInUser._id, status: 'accepted'}
            ]
        }).populate('fromUserId', USER_SAFE_FIELDS)
          .populate('toUserId', USER_SAFE_FIELDS);

        const data = connections.map(connection => connection.fromUserId._id.toString() === loggedInUser._id.toString() 
                                                    ? connection.toUserId : connection.fromUserId);

        res.status(200).json({
            message: "User connections fetched successfully",
            data
        });
    } catch(err) {
        res.status(400).send("Error while fetching user connections: " + err.message);
    }
});

router.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = Math.min(limit, 25);

        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find(
        {
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select('fromUserId toUserId');

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(request => {
            hideUsersFromFeed.add(request.fromUserId.toString());
            hideUsersFromFeed.add(request.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUsersFromFeed) }},
                {_id: { $ne: loggedInUser._id }}
            ]
        }).select(USER_SAFE_FIELDS)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            message: "Feed fetched successfully",
            data: users
        });
    } catch(err) {
        res.status(400).send("Error while fetching feed: " + err.message);
    }
});

module.exports = router;