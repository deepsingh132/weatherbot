import express from "express";
import { deleteApiKey, deleteBotToken, getKeys, updateBotToken, updateOpenWeatherApiKey } from "../controllers/settings";
import { isAuthenticated } from "../middleware";

export default (router: express.Router) => {
  router.get("/settings/keys",isAuthenticated, getKeys);
  router.put("/settings/keys/openweather-api-key", isAuthenticated, updateOpenWeatherApiKey);
  router.put("/settings/keys/bot-token", isAuthenticated, updateBotToken);
  router.delete("/settings/keys/openweather-api-key", isAuthenticated, deleteApiKey);
  router.delete("/settings/keys/bot-token", isAuthenticated, deleteBotToken);
};