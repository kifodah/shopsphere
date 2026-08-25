import express from "express";

import {
  checkout,
  orders,
  orderById,
  updateStatus,
} from "../controllers/orderController.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  checkout
);

router.get(
  "/",
  authenticate,
  orders
);

router.get(
  "/:id",
  authenticate,
  orderById
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateStatus
);

export default router;
