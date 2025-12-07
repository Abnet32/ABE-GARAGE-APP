// backend/controllers/serviceController
import type{ Request, Response } from "express";
import CommonService from "../models/CommonService";

// GET all services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await CommonService.find({ active: true });
    res.status(200).json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch services" });
  }
};

// GET single service by ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await CommonService.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch service" });
  }
};

// CREATE a new service
export const createService = async (req: Request, res: Response) => {
  try {
    const { service_name, service_description } = req.body;
    const newService = await CommonService.create({
      service_name,
      service_description,
      active: true,
    });
    res.status(201).json(newService);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create service" });
  }
};

// UPDATE a service by ID
export const updateService = async (req: Request, res: Response) => {
  try {
    const { service_name, service_description, active } = req.body;
    const updated = await CommonService.findByIdAndUpdate(
      req.params.id,
      { service_name, service_description, active },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update service" });
  }
};

// DELETE a service (soft delete by setting active=false)
export const deleteService = async (req: Request, res: Response) => {
  try {
    const deleted = await CommonService.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ message: "Service not found" });
    res
      .status(200)
      .json({ message: "Service deleted successfully", service: deleted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete service" });
  }
};
