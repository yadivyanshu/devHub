const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const User = require("../models/user");

const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
    const { page = 1, limit = 10 } = req.query; 
    const targetUserId = req.params.targetUserId;
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

           // Paginate messages
        const paginatedMessages = chat.messages
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) 
            .slice((page - 1) * limit, page * limit);

        const targetUserDetails = await User.findById(targetUserId).select("firstName lastName");
        const targetUserFullName = targetUserDetails.firstName + " " + targetUserDetails.lastName;
        res.status(200).json({
            chat: paginatedMessages,
            targetUser: targetUserFullName
        });
    } catch (err) {
        console.error(err);
    }
});

module.exports = chatRouter;