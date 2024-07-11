import { Hono } from "hono";
import { getAllVehicles,getVehicle,updateVehicle,deleteVehicle,createVehicle, getVehicleDetailsHandler} from "./vehicle.controller";
import { userRoleAuth,adminRoleAuth, adminOrUserAuth } from "../middleware/AuthorizeRole";

export const vehicleRouter = new Hono();

vehicleRouter.get("/vehicles", userRoleAuth,getAllVehicles);
vehicleRouter.get("/vehicles/:id", getVehicle);
vehicleRouter.put("/vehicles/:id", updateVehicle);
vehicleRouter.delete("/vehicles/:id", deleteVehicle);
vehicleRouter.post("/vehicles", createVehicle);
vehicleRouter.get("/vehicles/details", getVehicleDetailsHandler);
