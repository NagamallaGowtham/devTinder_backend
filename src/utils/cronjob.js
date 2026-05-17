const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const ConnectionRequest = require("../models/connectionRequest");
const sendEmail = require("./sendEmail");


// This job will run at 8 AM in the morning everyday.
cron.schedule("0 8 * * *", async () => {
    // Send emails to all people who got requests the previous day
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

        const listOfEmails = [
            ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
        ];

        for (const email of listOfEmails) {
            // Send Emails
            try {
                const res = await sendEmail.run(
                    "New friend requests pending for " + email,
                    "There are so many friend requests pending, please login to DevFrnd.com and accept or reject the requests."
                );
            } catch(err) {
                console.log(err);
            }
        }
    } catch(err) {
        console.log(err);
    }
});