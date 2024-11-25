import { MyContext } from "../../types/MyContext";
import Subscription from "../db/models/Subscription";
import User from "../db/models/User";


export const updateCity = async (ctx: MyContext) => {
  console.log("Received update_city command.");
  ctx.session.step = "update_city";

  ctx.reply(`Send me your location name (e.g., "Mumbai") to update your city.`);
  return;
};

export const updateFrequency = async (ctx: MyContext) => {
  console.log("Received update_frequency command.");
  ctx.session.step = "update_frequency";

  ctx.reply(
    `Send me your updates frequency (e.g., "hourly", "daily", "weekly").`
  );
  return;
};

export const handleSettings = async (ctx: MyContext, setting: string) => {
  console.log("Received settings command.");

  if (!ctx.chat || !ctx.message) return;;

  const chatId = ctx.chat.id.toString();

  if (setting === "city") return updateCity(ctx);
  if(setting === "frequency") return updateFrequency(ctx);

  // Find the user in the database
  const user = await User.findOne({ chatId });
  if (!user) return ctx.reply("User not found.");

  const sub = await Subscription.findOne({ userId: user._id });
  if (!sub) return ctx.reply("You are not subscribed.");

  if (ctx.session.step === "update_city" && ctx.message.text) {
    const location = ctx.message.text;
    sub.location = location;
    await sub.save();
    ctx.reply(`Your city has been updated to ${location}.`);
  } else if (ctx.session.step === "update_frequency" && ctx.message.text) {
    const frequency = ctx.message.text;

    if (!["hourly", "daily", "weekly"].includes(frequency)) {
      return ctx.reply(
        `Invalid frequency. Please send "hourly", "daily", or "weekly".`
      );
    }

    sub.frequency = frequency as "hourly" | "daily" | "weekly";
    await sub.save();
    ctx.reply(`Your updates frequency has been updated to ${frequency}.`);
  }

  return;
};
