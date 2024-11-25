import { MyContext } from "../../types/MyContext";
import Subscription from "../db/models/Subscription";
import User from "../db/models/User";
import { verifyLocation } from "../helpers/utils";

export const subscribe = async (ctx: MyContext, apiKey: string) => {
  console.log("Received subscribe command.");

  if (!ctx.chat || !ctx.message) return;

  const chatId = ctx.chat.id.toString();

  try {
    // Find the user in the database
    const user = await User.findOne({ chatId });
    if (!user) return ctx.reply("User not found.");
    if (user.isBanned) return ctx.reply("You are blocked from using this bot.");

    // Check if user is not subscribed
    const subscription = await Subscription.findOne({ userId: user._id });

    if (subscription && subscription.frequency) {
      ctx.reply(
        `You are already subscribed to weather updates. Reply with /unsubscribe to unsubscribe.`
      );
      return;
    }

    if (!subscription && !ctx.session.step) {
      ctx.reply(
        `Please use the command /start to subscribe to weather updates.`
      );
      return;
    }

    // Handle city input
    if (ctx.session.step === "city") {
      ctx.session.city = ctx.message.text;

      if (!ctx.session.city) {
        ctx.reply("Please enter a valid city name.");
        return;
      }

      const verifiedCityName = await verifyLocation(ctx.session.city, apiKey);

      if (!verifiedCityName.exists || !verifiedCityName.locationData) {
        ctx.reply("Please enter a valid city name.");
        return;
      }

      ctx.session.step = "frequency";

      await Subscription.findOneAndUpdate(
        { userId: user._id },
        {
          $setOnInsert: {
            userId: user._id,
            location: ctx.session.city,
            frequency: "",
          },
        },
        { upsert: true, new: true }
      );

      ctx.reply(
        `Great! Now, how often would you like to receive updates? Reply with one of these options: *hourly*, *daily*, or *weekly*.`,
        { parse_mode: "Markdown" }
      );
      return;
    }

    // Handle frequency input
    if (ctx.session.step === "frequency" && ctx.message.text) {
      const frequency = ctx.message.text.toLowerCase();

      if (!["hourly", "daily", "weekly"].includes(frequency)) {
        ctx.reply(
          "Invalid option. Please reply with *hourly*, *daily*, or *weekly*."
        );
        return;
      }

      await Subscription.findOneAndUpdate(
        { userId: user._id },
        { frequency },
        { new: true }
      );

      ctx.reply(
        `You're all set! You'll receive weather updates for ${ctx.session.city} ${frequency}.`
      );
      ctx.session.step = undefined;
      return;
    }
  } catch (error) {
    console.error(`Error subscribing to weather updates: ${error}`);
  }
};
