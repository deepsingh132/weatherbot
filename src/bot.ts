import { Bot, session } from "grammy";
import Settings, { Settings as SettingsType } from "./db/models/Settings";
import { handleEvents } from "./events/_handleEvents";
import { MyContext, MySession } from "../types/MyContext";
import Subscription from "./db/models/Subscription";
import { fetchWeather } from "./modules/weatherModule";
import { CronJob } from "cron";
import { seed } from "./seed";

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const MINUTE = 60 * 1000;
const WEEK = 7 * 24 * 60 * 60 * 1000;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Process subscriptions in batches of 50 at a time to avoid rate limits and improve performance
const BATCH_SIZE = 50;

let isJobRunning = false;

/* TODO:
1. Implement Redis for caching and rate limiting
2. Use external session store for better performance and scalability
*/

// Background job for weather updates
const sendWeatherUpdates = async (
  bot: Bot<MyContext>,
  settings: SettingsType
) => {

  if (isJobRunning) {
    console.log("Job is already running. Skipping this execution.");
    return;
  }

  isJobRunning = true;

  try {
    // console.log("Sending weather updates...");

    const totalSubscriptions = await Subscription.countDocuments();
    for (let skip = 0; skip < totalSubscriptions; skip += BATCH_SIZE) {
      const subscriptions = await Subscription.find()
        .skip(skip)
        .limit(BATCH_SIZE)
        .populate("userId");

      for (const subscription of subscriptions) {
        const user = subscription.userId;

        // Check if user is banned
        if (!user || user.isBanned) continue;

        const { location, frequency } = subscription;

        // Determine if we need to send an update
        const now = new Date();
        const lastSent = subscription.lastSent || new Date(0);
        let shouldSend = false;

        if (
          (frequency === "hourly" &&
            now.getTime() - lastSent.getTime() >= HOUR) ||
          (frequency === "daily" && now.getTime() - lastSent.getTime() >= DAY) ||
          (frequency === "weekly" && now.getTime() - lastSent.getTime() >= WEEK)
        ) {
          shouldSend = true;
        }

        if (shouldSend && location) {
          try {
            const weather = await fetchWeather(location, settings.apiKey);
            bot.api.sendMessage(user.chatId, `${weather}`);
            subscription.lastSent = new Date();
            await subscription.save();
          } catch (error) {
            console.error(
              `Error sending weather update for user ${user.chatId}:`,
              error
            );
          }
        }
      }

      await delay(1000); // delay to avoid rate limits
    }
  } catch (error) {
    console.error("Error sending weather updates:", error);
  }
  finally {
    isJobRunning = false;
  }
};

const initBot = async () => {

  try {
    // Fetch settings from the database
    const settings = await Settings.findOne();
    if (!settings) {
      await seed();
      throw new Error("Bot settings not configured.");
    }

    // Initialize the bot with grammY
    const bot = new Bot<MyContext>(settings.botToken);

    // Add session middleware
    bot.use(
      session({
        initial: (): MySession => ({ step: undefined }),
      })
    );

    // Register event handlers
    handleEvents(bot, settings);

    // Launch the bot
    bot.start();
    bot.catch((err) => console.error(err));

    new CronJob(
      "* * * * *",
      async () => await sendWeatherUpdates(bot, settings),
      null,
      true,
      "IST"
    );

    // bot is ready
    bot.api.getMe().then((me) => console.log(`Bot ${me.first_name} is running.`));
    return bot;
  } catch (error) {
    console.error("Error initializing bot:", error);
    return null;
  }
};

export default initBot;
