const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendEmail");
const ConnectionRequest = require("../models/connectionRequest");

cron.schedule("57 5 * * *", async () => {
    try {
        const yesterday = subDays(new Date(), 1);

        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lt: yesterdayEnd,
            },
        }).populate("fromUserId toUserId");

        const userRequestsMap = new Map();
        pendingRequests.forEach((req) => {
            const userEmail = req.toUserId.email;
            userRequestsMap.set(userEmail, (userRequestsMap.get(userEmail) || 0) + 1);
        });

        for (const [email, count] of userRequestsMap.entries()) {
            try {
                const res = await sendEmail.run(
                    "🔔 Requests Alerts",
                    `<div style="font-family: Arial, sans-serif; color: #333;">
                        <p><strong>${email}</strong>, you have <strong>${count}</strong> connection ${count > 1 ? "requests" : "request"} .</p>
                        <p>Stay connected and collaborate with like-minded professionals.</p>
                        <p><a href="https://devhub.work/" style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View Request</a></p>
                        <br>
                        <p>Thanks,</p>
                        <p>Your Team at DevHub</p>
                    </div>`
                );
            } catch (err) {
                console.log(err);
            }
        }
    } catch (err) {
        console.error(err);
    }
});