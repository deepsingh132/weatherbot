import { Bot } from "grammy";
import { MyContext } from "../types/MyContext";
import { config } from "dotenv";

config();
(async function registerBotCommands() {
  const bot = new Bot<MyContext>(process.env.BOT_TOKEN!);

  const result = await bot.api.setMyCommands([
    { command: "start", description: " 🚀  Start the bot." },
    { command: "subscribe", description: " 🌡️  Subscribe to weather updates." },
    {
      command: "unsubscribe",
      description: " 👋  Unsubscribe from weather updates.",
    },
    { command: "current", description: " 🌡️  Get current weather for a location eg. /current New Delhi" },
    { command: "help", description: " 🆘  Get help with the bot." },
    { command: "about", description: "🤖  Get information about the bot." },
    { command: "update_city", description: "🌆  Update your city." },
    {
      command: "update_frequency",
      description: "⏱️  Update your weather updates frequency.",
    },
  ]);

  console.log(result);
})();
