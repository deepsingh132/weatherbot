import express from "express";

import { deleteAdmin, getAllAdmins, updateAdmin } from "../controllers/admins";
import { isAuthenticated, isOwner } from "../middleware/index";
import { createAdmin } from "../db/models/Admin";

export default (router: express.Router) => {
  router.get("/admins", isAuthenticated, getAllAdmins);
  router.delete("/admin/:id", isAuthenticated, isOwner, deleteAdmin);
  router.patch("/admin/:id", isAuthenticated, isOwner, updateAdmin);
  router.post("/admin/register", isAuthenticated, isOwner, createAdmin);
};
