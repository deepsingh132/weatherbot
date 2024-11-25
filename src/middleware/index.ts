import express from "express";

import { Request, Response, NextFunction } from "express";

import { get, merge } from "lodash";

import { getAdminBySessionToken } from "../db/models/Admin";

import _ from "lodash";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken = req.cookies["WEATHERBOT-AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingAdmin = await getAdminBySessionToken(sessionToken);

    if (!existingAdmin) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingAdmin });

    return next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentAdminId = get(req, _.toString("identity._id")) as string;

    if (!currentAdminId) {
      return res.sendStatus(403);
    }

    if (currentAdminId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
