import express from "express";
import { getDevicesByBrand } from "../controllers/deviceController.js";

const router = express.Router();

// GET /api/devices/:brandid
router.get("/:brandid", getDevicesByBrand);

export default router;