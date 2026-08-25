import {
  addToCart,
  getCart,
} from "../services/cartService.js";

export async function add(req, res) {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive integer",
      });
    }

    const item = await addToCart(
      req.user.id,
      productId,
      quantity
    );

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

export async function view(req, res) {
  try {
    const cart = await getCart(req.user.id);

    res.json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve cart",
    });
  }
}
