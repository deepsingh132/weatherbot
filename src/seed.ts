import { connectDB } from "./db/connection";
import Settings from "./db/models/Settings";
import { configDotenv } from "dotenv";

configDotenv();

export const seed = async () => {
  try {
    const settings = new Settings({
      apiKey: process.env.OPEN_WEATHER_API_KEY,
      botToken: process.env.BOT_TOKEN,
      createdBy: process.env.ADMIN_NAME || "Admin",
      createdAt: new Date(),
    });
    await settings.save();
    console.log("Settings seeded successfully");
    return process.exit(0);
  } catch (error) {
    console.error("Error seeding settings:", error);
    return;
  }
}