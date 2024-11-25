import User from "../db/models/User";
import { MyContext } from "../../types/MyContext";
import Subscription from "../db/models/Subscription";
import { Settings } from "../db/models/Settings";

interface fileRespone {
  ok: boolean;
  result: {
    file_id: string;
    file_unique_id: string;
    file_size: number;
    file_path: string;
  };
}

async function getUserAvatar(ctx: MyContext, settings: Settings) {
  const profilePhotos = await ctx.getUserProfilePhotos();

  if (profilePhotos.total_count > 0) {
    const photo = profilePhotos.photos[0][0];

    const fileRespone = await fetch(
      `https://api.telegram.org/bot${settings.botToken}/getFile?file_id=${photo.file_id}`);

    const photoUrlJson = await fileRespone.json() as fileRespone;
    const url = `https://api.telegram.org/file/bot${settings.botToken}/${photoUrlJson.result.file_path}`;

    return url;
  }
  return null;
}

export const start = async (ctx: MyContext, settings: Settings) => {
  console.log("Received start command.");

  if (!ctx.chat) return;

  const chatId = ctx.chat.id.toString();

  try {
    const userAvatar = await getUserAvatar(ctx, settings);

    const firstName = ctx.from?.first_name || "Unknown";
    const lastName = ctx.from?.last_name || "";

    const fullName = `${firstName} ${lastName}`;

    // Register the user if not already in the database
    const user = await User.findOneAndUpdate(
      { chatId },
      {
        $setOnInsert: {
          chatId,
          name: fullName.trim(),
          avatar: userAvatar,
          lastAccess: new Date(),
          isBanned: false,
        },
      },
      { upsert: true, new: true }
    );

    const subscription = await Subscription.findOne({ userId: user._id });
    if (subscription) return ctx.reply("You are already subscribed ✅");

    ctx.session.step = "city";
    ctx.reply(
      `Welcome! Send me your location name (e.g., "Mumbai") to subscribe for weather updates.`
    );
  } catch (error) {
    console.error(error);
  }
};
