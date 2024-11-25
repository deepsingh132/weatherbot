import express from "express";
import Settings from "../db/models/Settings";
import User from "../db/models/User";

// const router = express.Router();

export default (router: express.Router) => {

  router.get("/users", async (_, res) => {
    const users = await User.find();
    res.json(users);
  });

  // router.get("/banned-users", async (_, res) => {
  //   const users = await User.find({ banned: true });
  //   res.json(users);
  // });

  router.patch("/ban/:id", async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isBanned: true });
    res.json({ message: "User banned" });
  });

  router.patch("/unban/:id", async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(id, { isBanned: false });
    res.json({ message: "User unbanned" });
  });

  router.delete("/user/:id", async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
  });

  return router;
};
