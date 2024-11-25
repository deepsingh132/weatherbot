import express from "express";

import {
  deleteAdminById,
  getAdminById,
  getAdmins,
} from "../db/models/Admin";
import { random, authentication as auth } from "../helpers/index";


const HOSTNAME = process.env.HOSTNAME || "localhost";

export const getAllAdmins = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const admins = await getAdmins();

    return res.status(200).json(admins);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const deleteAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedAdmin = await deleteAdminById(id);

    console.log("Admin deleted: ", deletedAdmin);
    return res.json(deletedAdmin);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateAdmin = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

    if (!username || !password) {
      return res.status(400).send("Username and password is required");
    }

    const admin = await getAdminById(id);

    if (!admin) {
      return res.sendStatus(404);
    }

    const salt = random();
    admin.username = username;
    admin.authentication.salt = salt;
    admin.authentication.password = auth(salt, password);

    admin.authentication.sessionToken = auth(salt, admin._id.toString());

    await admin.save();

    res.cookie("WEATHERBOT-AUTH", admin.authentication.sessionToken, {
      path: "/",
      httpOnly: true,
      sameSite: "none",
      partitioned: true,
      maxAge: 1000 * 60 * 60 * 24 *  1, // 1 day
      // secure disabled for development
      secure: HOSTNAME !== "localhost",
    });

    return res.status(200).json(admin).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
