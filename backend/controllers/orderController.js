import { StatusCodes } from "http-status-codes";
import CustomError from "../errors/errorIndex.js";
import Order from "../models/Order.js";
import BadRequestError from "../errors/bad-request.js";

//user
const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, itemsPrice } = req.body;
  if (!orderItems || orderItems.length === 0) {
    throw new CustomError.BadRequestError("Order items must be provided");
  }
  if (!shippingAddress || !itemsPrice) {
    throw new CustomError.BadRequestError("Order info must be fully provided");
  }
  const order = await Order.create({
    orderItems,
    shippingAddress,
    itemsPrice,
    user: req.user.userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Order Created", orderId: order._id });
};

const cancelOrder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Order Id Needs to be provided");
  }
  const order = await Order.findOne({ _id: id, user: req.user.userId });
  if (!order) {
    throw new CustomError.NotFoundError("Order not found in your orders");
  }
  if (order.shippingStatus === "canceled") {
    throw new CustomError.BadRequestError("Order is already canceled");
  }
  if (order.shippingStatus === "rejected") {
    throw new CustomError.BadRequestError("Order is rejected");
  }
  if (order.shippingStatus === "sent") {
    throw new CustomError.BadRequestError("Order already sent");
  }
  order.shippingStatus = "canceled";
  await order.save();
  res.status(StatusCodes.OK).json({ msg: "Order Canceled" });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ nbHits: orders.length, orders });
};

const getSingleOrder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new BadRequestError("Id needs to be provided");
  }
  if (!req.user.isAdmin) {
    const order = await Order.findOne({
      _id: id,
      user: req.user.userId,
    })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      })
      .populate({
        path: "user",
        select: "_id username email",
      });
    if (!order) {
      throw new CustomError.NotFoundError("Order not found in your orders");
    }
    return res.status(StatusCodes.OK).json({ order });
  }
  if (req.user.isAdmin) {
    const order = await Order.findOne({
      _id: id,
    })
      .populate({
        path: "orderItems",
        populate: {
          path: "product",
        },
      })
      .populate({
        path: "user",
        select: "_id username email",
      });
    if (!order) {
      throw new CustomError.NotFoundError("Order not found ");
    }
    return res.status(StatusCodes.OK).json({ order });
  }
};
//admin

const getAllOrders = async (req, res) => {
  const { shippingStatus = "" } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const queryObject = {};

  if (shippingStatus) {
    queryObject.shippingStatus = shippingStatus;
  }

  const orders = await Order.find(queryObject)
    .populate({
      path: "user",
      select: "_id username email",
    })
    .skip(skip)
    .limit(limit);

  const totalOrders = await Order.countDocuments();
  const nextPage = page < Math.ceil(totalOrders / limit) ? page + 1 : null;

  res.status(200).json({
    nbHits: orders.length,
    page,
    nextPage,
    orders,
  });
};
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!id) {
    throw new CustomError.BadRequestError("Id needs to be provided");
  }
  if (!status) {
    throw new CustomError.BadRequestError("Status needs to be provided");
  }
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new CustomError.NotFoundError("Order not found");
  }
  order.shippingStatus = status;
  await order.save();
  res.status(StatusCodes.OK).json({ msg: `Order status updated to ${status}` });
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomError.BadRequestError("Id needs to be provided");
  }
  const order = await Order.findOne({ _id: id });
  if (!order) {
    throw new CustomError.NotFoundError("Order not found");
  }
  await order.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Order Deleted" });
};

const countTotalOrders = async (req, res) => {
  const totalOrders = await Order.countDocuments();
  res.status(StatusCodes.OK).json({ totalOrders });
};

const countTotalSales = async (req, res) => {
  const orders = await Order.find({ shippingStatus: "sent" });

  const total = orders.reduce((sum, order) => sum + order.itemsPrice, 0);

  res.status(StatusCodes.OK).json({ totalSales: total });
};

export {
  createOrder,
  cancelOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  countTotalOrders,
  countTotalSales,
};
