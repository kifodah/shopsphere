import express from "express";
import {
  create,
  getAll,
} from "../controllers/categoryController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAll);

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  create
);

export default router;
