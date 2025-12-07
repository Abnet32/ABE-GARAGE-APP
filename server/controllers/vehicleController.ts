import type{ Request, Response } from "express";
import Vehicle from "../models/Vehicle.js";

// @desc Get all vehicles
export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find().populate("customer_id");
    res.status(200).json(vehicles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vehicles", error: err });
  }
};

// @desc Get vehicle by ID
export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "customer_id"
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: "Error fetching vehicle", error: err });
  }
};

// @desc Create new vehicle
export const createVehicle = async (req: Request, res: Response) => {
  try {
    const newVehicle = await Vehicle.create(req.body);
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(500).json({ message: "Error creating vehicle", error: err });
  }
};

// @desc Update vehicle
export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating vehicle", error: err });
  }
};

// @desc Delete vehicle
export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting vehicle", error: err });
  }
};
