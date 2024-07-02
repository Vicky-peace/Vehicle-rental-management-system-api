import { Hono } from "hono";
import { getAllVehicles, getVehicle, updateVehicle, deleteVehicle,createVehicle } from "./vehicleSpecifiactions.controller";

export const vehicleSpecificationRouter = new Hono();

vehicleSpecificationRouter.get("/vehiclesSpecifications",getAllVehicles );
vehicleSpecificationRouter.get("/vehiclesSpecifications/:id", getVehicle);
vehicleSpecificationRouter.put("/vehiclesSpecifications/:id", updateVehicle);
vehicleSpecificationRouter.delete("/vehiclesSpecifications/:id", deleteVehicle);
vehicleSpecificationRouter.post("/vehiclesSpecifications", createVehicle);


