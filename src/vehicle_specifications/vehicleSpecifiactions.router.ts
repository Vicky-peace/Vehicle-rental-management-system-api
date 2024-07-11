import { Hono } from "hono";
import { getAllVehicles, getVehicle, updateVehicle, deleteVehicle,createVehicle,getVehicleWithSpecController,getVehicleWithSpecsByIdController } from "./vehicleSpecifiactions.controller";
import { userRoleAuth,adminRoleAuth, adminOrUserAuth } from "../middleware/AuthorizeRole";

export const vehicleSpecificationRouter = new Hono();

vehicleSpecificationRouter.get("/vehiclesSpecifications",userRoleAuth,getAllVehicles );
vehicleSpecificationRouter.get("/vehiclesSpecifications/:id", getVehicle);
vehicleSpecificationRouter.put("/vehiclesSpecifications/:id", updateVehicle);
vehicleSpecificationRouter.delete("/vehiclesSpecifications/:id", deleteVehicle);
vehicleSpecificationRouter.post("/vehiclesSpecifications", createVehicle);
vehicleSpecificationRouter.get("/vehicles/specs", getVehicleWithSpecController);
vehicleSpecificationRouter.get("/vehicles/specs/:id", getVehicleWithSpecsByIdController);
