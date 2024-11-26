import { Bot } from "grammy";
import { MyContext } from "../../types/MyContext";
import { start } from "./start";
import { subscribe } from "./subscribe";
import { handleSettings } from "./settings";
import { unsubscribe } from "./unsubscribe";
import { Settings } from "../db/models/Settings";

const BOT_HELP_TEXT = `🆘 **Help Menu**
Here’s a list of commands to help you navigate the Weather Bot! 🌦

**Commands:**
- \`/start\` - 🚀 Start the bot and explore features.
- \`/subscribe\` - 🌡️ Subscribe to daily weather updates.
- \`/unsubscribe\` - 👋 Stop receiving weather updates.
- \`/current <city>\` - 🌡️ Get current weather for a location (e.g., \`/current New Delhi\`).
- \`/update_city\` - 🌆 Update your preferred city.
- \`/update_frequency\` - ⏱️ Change how often you receive weather updates.
- \`/about\` - 🤖 Learn more about the bot.
- \`/help\` - 🆘 Display this help menu.

🔍 **Need More Info?**
Use \`/about\` to learn how I work or explore weather details with \`/current\`.

Stay updated with the latest weather at your fingertips! 😊
`;

const BOT_ABOUT_TEXT = `🌦 **Hello there! I’m your Weather Assistant Bot!** 🤖
I’m here to provide you with the latest weather updates, forecasts, and information at your fingertips. 🌍✨

**Here’s what I can do for you:**
- 🌡 **Current Weather:** Get real-time weather conditions for any location you like.
- 📅 **Hourly & Daily Forecasts:** Plan your days better with accurate forecasts.
- 📍 **Location-Based Updates:** Save your preferred location for instant updates.
- ❓ **Interactive Commands:** Use simple commands to get the info you need—effortless and quick!

**Tech behind me:**
Built with the power of the **Grammy Framework** 🧩, I’m fast, secure, and easy to use. Backed by the **OpenWeatherMap API**, my weather updates are always on point. 🌟

**Need Help?** Use \`/help\` to see a list of commands and start exploring!

Stay safe and weather-ready, always! ☀️🌧❄️
*Your friendly Weather Bot* 😊  `;

const handleCommands = async (bot: Bot<MyContext>, ctx: MyContext, settings: Settings) => {

  // if command not registered, ignore
  const registeredCommands = await bot.api.getMyCommands();
  if (!registeredCommands.some((c) => c.command === ctx.message?.text?.slice(1))) {
    ctx.reply(`Unknown command: ${ctx.message?.text}`);
    return;
  }

  const command = ctx.message?.text?.slice(1);
  console.log(`Received command: ${command}`);
  switch (command?.split(" ")[0]) {
    case "start":
      await start(ctx, settings);
      break;
    case "subscribe":
      await subscribe(ctx, settings?.apiKey);
      break;
    case "unsubscribe":
      await unsubscribe(ctx);
      break;
    case "help":
      await ctx.reply(`${BOT_HELP_TEXT}`);
      break;
    case "about":
      await ctx.reply(`${BOT_ABOUT_TEXT}`);
      break;
    case "update_city":
      await handleSettings(ctx, "city");
      break;
    case "update_frequency":
      await handleSettings(ctx, "frequency");
      break;
    default:
      await ctx.reply(`Unknown command: ${command}`);
  }
  return;
}

export default handleCommands;