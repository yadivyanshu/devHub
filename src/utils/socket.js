const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const redis = require("./redis")

const getSecretRoomId = (userId, targetUserId) => {
    return crypto
      .createHash("sha256")
      .update([userId, targetUserId].sort().join("$"))
      .digest("hex");
};

const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        },
    });

    io.on("connection", (socket) => {
        let userId = null; // Track user ID associated with this socket

        socket.on("userConnected", async (id) => {
            userId = id;
            await redis.sadd("onlineUsers", userId); 
            io.emit("userStatusUpdated", { userId, status: "online", timestamp: Date.now() });
        });

        socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
            const roomId = getSecretRoomId(userId, targetUserId);
            socket.join(roomId);
        });

        socket.on("sendMessage",
            async ({ firstName, lastName, userId, targetUserId, text }) => {
              try {
                  const roomId = getSecretRoomId(userId, targetUserId);

                  let chat = await Chat.findOne({
                      participants: { $all: [userId, targetUserId] },
                  });

                  if (!chat) {
                      chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: [],
                      });
                  }

                  chat.messages.push({
                      senderId: userId,
                      text,
                  });

                  await chat.save();

                  io.to(roomId).emit("messageReceived", { firstName, lastName, text });
              } catch (err) {
                  console.log(err);
              }
            }
        );

        socket.on("disconnect", async () => {
            if (userId) {
                // Add a small delay to handle rapid reconnections
                setTimeout(async () => {
                    // Check if user has any active socket connections
                    const userSockets = await io.fetchSockets();
                    const activeUserSockets = userSockets.filter(
                        s => s.userId === userId
                    );

                    if (activeUserSockets.length === 0) {
                        await redis.srem("onlineUsers", userId);
                        io.emit("userStatusUpdated", { 
                            userId, 
                            status: "offline",
                            timestamp: Date.now()
                        });
                    }
                }, 10000);
            }
        });
  });

  // Optional: Periodic cleanup of stale online users
    setInterval(async () => {
        const onlineUsers = await redis.smembers("onlineUsers");
        // Implement additional logic if needed for long-term offline detection
    }, 5 * 60 * 1000); // Every 5 minutes
};

module.exports = initializeSocket;