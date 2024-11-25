import { MyContext } from "../../types/MyContext";
import Subscription from "../db/models/Subscription";
import User from "../db/models/User";

export const unsubscribe = async (ctx: MyContext) => {
  console.log("Received unsubscribe command.");

  if (!ctx.chat) return;

  const chatId = ctx.chat.id.toString();

  try {
    // Find the user in the database
    const user = await User.findOne({ chatId });
    if (!user) return ctx.reply("User not found.");

    const subscription = await Subscription.findOne({ userId: user._id });
    if (!subscription) return ctx.reply("You are not subscribed.");

    // Delete the subscription from the database
    await Subscription.deleteOne({ userId: user._id });

    ctx.reply("👋 Goodbye! You have been unsubscribed from weather updates.");
  } catch (error) {
    console.error(`Error unsubscribing from weather updates: ${error}`);
  }
};
