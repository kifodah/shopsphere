import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
} from "../controllers/productController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAll);
router.get("/:id", getOne);

// Admin routes
router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  create
);

router.put(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  update
);

router.delete(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  remove
);

export default router;
