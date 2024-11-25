import { MyContext } from "../../types/MyContext";
import { Settings } from "../db/models/Settings";
import { fetchWeather } from "../modules/weatherModule";

export const getCurrentWeather = async (ctx: MyContext, settings: Settings) => {
  console.log("Received current_weather command.");

  if (!ctx.match) {
    return ctx.reply("Please provide a location \neg: /current Mumbai");
  }

  const location = ctx.match as string;

  await ctx.replyWithChatAction("typing");
  const weather = await fetchWeather(location, settings.apiKey);

  await ctx.reply(weather);
};
