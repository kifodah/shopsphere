import express from "express";
import {
  add,
  view,
} from "../controllers/cartController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", authenticate, add);

router.get("/", authenticate, view);

export default router;
