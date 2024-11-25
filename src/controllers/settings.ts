import express from "express";
import Settings, { Settings as SettingsType } from "../db/models/Settings";

export const getKeys = async (req: express.Request, res: express.Response) => {
  try {
    const {
      apiKey,
      botToken,
      createdAt,
      createdBy
    } = (await Settings.findOne()) as SettingsType;

    // if (!apiKey) {
    //   return res.status(404).json({ message: "API key not found" });
    // }

    // if (!botToken) {
    //   return res.status(404).json({ message: "Bot token not found" });
    // }

    return res
      .status(200)
      .json({
        apiKey,
        botToken,
        createdAt,
        createdBy
      });
  } catch (error) {
    console.error("Error fetching API key:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOpenWeatherApiKey = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({ message: "API key is required" });
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { apiKey },
      { upsert: true, new: true }
    );
    return res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error updating API key:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getBotToken = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { botToken } = (await Settings.findOne()) as SettingsType;

    if (!botToken) {
      return res.status(404).json({ message: "Bot token not found" });
    }

    return res.status(200).json({ botToken });
  } catch (error) {
    console.error("Error fetching bot token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateBotToken = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { botToken } = req.body;

    if (!botToken) {
      return res.status(400).json({ message: "Bot token is required" });
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { botToken },
      { upsert: true, new: true }
    );
    return res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error updating bot token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteApiKey = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { apiKey: null },
      { upsert: true, new: true }
    );
    return res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error deleting API key:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteBotToken = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { botToken: null },
      { upsert: true, new: true }
    );
    return res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error deleting bot token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};