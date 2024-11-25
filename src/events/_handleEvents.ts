import { Bot } from "grammy";
import { Settings } from "../db/models/Settings";
import handleCommands from "../commands/handleCommands";
import { MyContext } from "../../types/MyContext";
import { subscribe } from "../commands/subscribe";
import { handleSettings } from "../commands/settings";
import { getCurrentWeather } from "../commands/current_weather";

export const handleEvents = (bot: Bot<MyContext>, settings: Settings) => {
  bot.command("current", async (ctx) => await getCurrentWeather(ctx, settings));

  // Handle text messages (location input)
  bot.on("message:text", async (ctx) => {
    // only continue if message is a command
    if (ctx.message.text.startsWith("/") && !ctx.message.text.startsWith("/current")) return handleCommands(bot, ctx, settings);
    // If user has a session step, subscribe
    if (ctx.session.step === "city" || ctx.session.step === "frequency") {
      return subscribe(ctx, settings.apiKey);
    }

    if (
      ctx.session.step === "update_city" ||
      ctx.session.step === "update_frequency"
    )
      return handleSettings(ctx, ctx.message.text);
  });
};
