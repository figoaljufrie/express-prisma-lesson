import cron from "node-cron";

export const reminder2Schedule = () => {
  cron.schedule("*/10 * * * * *", () => {
    console.log("running task every 10 seconds.");
  });
  
};
