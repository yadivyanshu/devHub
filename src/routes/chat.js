const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const User = require("../models/user");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;

    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName",
        });
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: [],
            });
            await chat.save();
        }

        const targetUserDetails = await User.findById(targetUserId).select("firstName lastName");
        const targetUserFullName = targetUserDetails.firstName + " " + targetUserDetails.lastName;
        res.status(200).json({
            chat,
            targetUser: targetUserFullName
        });
    } catch (err) {
        console.error(err);
    }
});

module.exports = chatRouter;