import { Hono } from "hono";
import { getAllVehicles,getVehicle,updateVehicle,deleteVehicle,createVehicle } from "./vehicle.controller";

export const vehicleRouter = new Hono();

vehicleRouter.get("/vehicles", getAllVehicles);
vehicleRouter.get("/vehicles/:id", getVehicle);
vehicleRouter.put("/vehicles/:id", updateVehicle);
vehicleRouter.delete("/vehicles/:id", deleteVehicle);
vehicleRouter.post("/vehicles", createVehicle);