import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} from "../services/orderService.js";

const VALID_STATUSES = [
  "PENDING",
  "PAID",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function checkout(req, res) {
  try {
    const order = await createOrder(req.user.id);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function orders(req, res) {
  try {
    const result = await getUserOrders(req.user.id);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function orderById(req, res) {
  try {
    const order = await getOrderById(
      req.user.id,
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function updateStatus(req, res) {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed values: ${VALID_STATUSES.join(
          ", "
        )}`,
      });
    }

    const order = await updateOrderStatus(
      req.params.id,
      status
    );

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
