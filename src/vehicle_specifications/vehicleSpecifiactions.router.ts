import { Hono } from "hono";
import { getAllVehicles, getVehicle, updateVehicle, deleteVehicle,createVehicle,getVehicleWithSpecController,getVehicleWithSpecsByIdController,createVehicleWithSpecController,updateVehicleController } from "./vehicleSpecifiactions.controller";
import { userRoleAuth,adminRoleAuth, adminOrUserAuth } from "../middleware/AuthorizeRole";

export const vehicleSpecificationRouter = new Hono();

vehicleSpecificationRouter.get("/vehiclesSpecifications",getAllVehicles );
vehicleSpecificationRouter.get("/vehiclesSpecifications/:id", getVehicle);

vehicleSpecificationRouter.delete("/vehiclesSpecifications/:id", deleteVehicle);
vehicleSpecificationRouter.post("/vehiclesSpecifications", createVehicle);
vehicleSpecificationRouter.get("/vehicles/specs", getVehicleWithSpecController);
vehicleSpecificationRouter.get("/vehicles/specs/:id", getVehicleWithSpecsByIdController);


vehicleSpecificationRouter.post("/vehicleSpecs", createVehicleWithSpecController, )
vehicleSpecificationRouter.put("/vehicles/:id", updateVehicleController);