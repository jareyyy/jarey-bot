import cron from "node-cron";

// learn more about cron time here:
// https://www.npmjs.com/package/node-cron?activeTab=readme
const jobs = [
    {
        time: "0 22 * * *", // every day at 22:00 (10 PM)
        message: () => "It's 10 PM, good night!",
    },
    {
        time: "21 22 * * *", // every day at 22:21 (10:21 PM)
        message: () => "It's 10:21 PM, good night!",
    },
    {
        time: "0 9 * * *", // every day at 09:00 (9 AM)
        message: () => "Good morning! It's 9 AM! \n Gising na boss!",
    },
    {
        time: "0 12 * * *", // every day at 12:00 (noon)
        message: () => "It's noon! Time for lunch!",
    },
    {
        time: "0 18 * * *", // every day at 18:00 (6 PM)
        message: () => "It's 6 PM, time to wrap up the day!",
    },
    {
        time: "0 0 * * *", // every day at 00:00 (midnight)
        message: () => "It's midnight! A new day has begun!",
    },
];

export default function autoSend() {
    const timezone = global.config?.timezone || "Asia/Ho_Chi_Minh";
    if (!timezone) return;

    for (const job of jobs) {
        cron.schedule(
            job.time,
            () => {
                let i = 0;
                for (const tid of job.targetIDs ||
                    Array.from(global.data.threads.keys()) ||
                    []) {
                    setTimeout(async () => {
                        try {
                            const msg = await job.message();
                            await global.api.sendMessage(
                                typeof msg == "string"
                                    ? {
                                          body: job.message(),
                                      }
                                    : msg,
                                tid
                            );
                        } catch (e) {
														console.error(e);
												}
                    }, i++ * 300);
                }
            },
            {
                timezone: timezone,
            }
        );
    }
}
