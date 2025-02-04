const mongoose = require("mongoose");
const schema = mongoose.Schema;

const messageSchema = new schema(
    {
        senderId: {
            type: schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const chatSchema = new schema({
    participants: [
        { type: schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [messageSchema],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = { Chat };