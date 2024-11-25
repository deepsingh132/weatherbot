import { Bot } from "grammy";
import { MyContext } from "../../types/MyContext";
import { start } from "./start";
import { subscribe } from "./subscribe";
import { handleSettings } from "./settings";
import { unsubscribe } from "./unsubscribe";
import { Settings } from "../db/models/Settings";

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
      await subscribe(ctx);
      break;
    case "unsubscribe":
      await unsubscribe(ctx);
      break;
    case "help":
      await ctx.reply(`Send me your location name (e.g., "Mumbai") to subscribe for weather updates.`);
      break;
    case "about":
      await ctx.reply(`This bot is a weather forecast bot. Send me your location name (e.g., "Mumbai") to subscribe for weather updates.`);
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