import type{ Request, Response } from "express";
import Order from "../models/Order.js";
import OrderInfo from "../models/OrderInfo.js";
import OrderService from "../models/OrderService.js";
import CustomerIdentifier from "../models/CustomerIdentifier.js";
import CustomerInfo from "../models/CustomerInfo.js";
import Vehicle from "../models/Vehicle.js";
import EmployeeInfo from "../models/EmployeeInfo.js";
import Employee from "../models/Employee.js";
import CommonService from "../models/CommonService.js";

// -----------------------------
// HELPER: Format order response for frontend
// -----------------------------
const formatOrderResponse = async (order: any) => {
  const orderObj = order.toObject ? order.toObject() : order;
  
  // Get order info
  const info = await OrderInfo.findOne({ order_id: orderObj._id });
  
  // Get services with populated service details
  const orderServices = await OrderService.find({
    order_id: orderObj._id,
  }).populate("service_id");

  // Populate customer info
  let customerData = orderObj.customer_id;
  if (customerData && typeof customerData === 'object') {
    const customerInfo = await CustomerInfo.findOne({ customer_id: customerData._id || customerData });
    customerData = {
      ...customerData,
      ...(customerInfo?.toObject() || {}),
    };
  }

  // Populate employee info
  let employeeData = orderObj.employee_id;
  if (employeeData && typeof employeeData === 'object' && employeeData._id) {
    const employeeInfo = await EmployeeInfo.findOne({ employee_id: employeeData._id });
    const employeeRecord = await Employee.findById(employeeData._id);
    employeeData = {
      ...employeeData,
      ...(employeeRecord?.toObject() || {}),
      ...(employeeInfo?.toObject() || {}),
    };
  }

  // Format vehicle data
  let vehicleData = orderObj.vehicle_id;
  if (vehicleData && typeof vehicleData === 'object') {
    vehicleData = {
      ...vehicleData,
    };
  }

  return {
    _id: orderObj._id,
    id: orderObj._id,
    customer_id: customerData,
    vehicle_id: vehicleData,
    employee_id: employeeData,
    order_date: orderObj.order_date || orderObj.createdAt,
    order_hash: orderObj.order_hash,
    order_status: orderObj.order_status || "Received",
    createdAt: orderObj.createdAt,
    updatedAt: orderObj.updatedAt,
    info: info ? {
      order_id: info.order_id,
      order_total_price: info.order_total_price || 0,
      order_estimated_completion_date: info.order_estimated_completion_date,
      order_completion_date: info.order_completion_date,
      order_additional_requests: info.order_additional_requests || "",
    } : null,
    services: orderServices.map((os: any) => ({
      order_id: os.order_id,
      service_id: os.service_id,
      service_completed: os.service_completed,
      _id: os._id,
    })),
  };
};

// -----------------------------
// GET ALL ORDERS
// -----------------------------
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("customer_id")
      .populate("employee_id")
      .populate("vehicle_id")
      .sort({ createdAt: -1 }); // Most recent first

    const enrichedOrders = await Promise.all(
      orders.map((order) => formatOrderResponse(order))
    );

    res.json(enrichedOrders);
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// -----------------------------
// GET ORDER BY ID
// -----------------------------
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer_id")
      .populate("employee_id")
      .populate("vehicle_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const formattedOrder = await formatOrderResponse(order);
    res.json(formattedOrder);
  } catch (error: any) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Failed to fetch order", error: error.message });
  }
};

// -----------------------------
// CREATE NEW ORDER
// -----------------------------
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer_id, employee_id, vehicle_id, services, total_price, description } =
      req.body;

    // Validate required fields
    if (!customer_id || !vehicle_id) {
      return res.status(400).json({ 
        message: "Customer ID and Vehicle ID are required" 
      });
    }

    // Validate customer exists
    const customerExists = await CustomerIdentifier.findById(customer_id);
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Validate vehicle exists
    const vehicleExists = await Vehicle.findById(vehicle_id);
    if (!vehicleExists) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Validate employee if provided
    if (employee_id) {
      const employeeExists = await Employee.findById(employee_id);
      if (!employeeExists) {
        return res.status(404).json({ message: "Employee not found" });
      }
    }

    // Create order
    const order = await Order.create({
      customer_id,
      employee_id: employee_id || undefined,
      vehicle_id,
      order_status: "Received",
      order_hash: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      order_date: new Date(),
    });

    // Create order info
    await OrderInfo.create({
      order_id: order._id,
      order_total_price: total_price || 0,
      order_estimated_completion_date: new Date(Date.now() + 86400000), // +1 day
      order_additional_requests: description || "",
    });

    // Create order services
    if (services && Array.isArray(services) && services.length > 0) {
      for (const serviceId of services) {
        // Validate service exists
        const serviceExists = await CommonService.findById(serviceId);
        if (serviceExists) {
          await OrderService.create({
            order_id: order._id,
            service_id: serviceId,
          });
        }
      }
    }

    // Fetch and return fully populated order
    const populatedOrder = await Order.findById(order._id)
      .populate("customer_id")
      .populate("employee_id")
      .populate("vehicle_id");

    if (!populatedOrder) {
      return res.status(500).json({ message: "Failed to retrieve created order" });
    }

    const formattedOrder = await formatOrderResponse(populatedOrder);

    res.status(201).json({
      message: "Order created successfully",
      order: formattedOrder,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      message: "Failed to create order",
      error: error.message 
    });
  }
};

// -----------------------------
// UPDATE ORDER STATUS
// -----------------------------
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { order_status } = req.body;
    const orderId = req.params.id;

    // Validate status value
    const validStatuses = ["Received", "In Progress", "Completed", "Canceled"];
    if (order_status && !validStatuses.includes(order_status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    // Update order
    const updated = await Order.findByIdAndUpdate(
      orderId,
      { order_status: order_status || "Received" },
      { new: true }
    )
      .populate("customer_id")
      .populate("employee_id")
      .populate("vehicle_id");

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If status is Completed, update completion date in OrderInfo
    if (order_status === "Completed") {
      await OrderInfo.findOneAndUpdate(
        { order_id: orderId },
        { order_completion_date: new Date() },
        { upsert: true }
      );
    }

    // Return fully formatted order
    const formattedOrder = await formatOrderResponse(updated);
    res.json(formattedOrder);
  } catch (error: any) {
    console.error("Error updating order:", error);
    res.status(500).json({ 
      message: "Failed to update order",
      error: error.message 
    });
  }
};

// -----------------------------
// DELETE ORDER
// -----------------------------
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const order_id = req.params.id;

    // Check if order exists
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Delete related data
    await OrderInfo.deleteOne({ order_id });
    await OrderService.deleteMany({ order_id });
    await Order.findByIdAndDelete(order_id);

    res.json({ message: "Order deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting order:", error);
    res.status(500).json({ 
      message: "Failed to delete order",
      error: error.message 
    });
  }
};
