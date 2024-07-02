import { Hono } from "hono";
import { listLocation,getLocation, updateLocation,deleteLocation,createLocation} from "./locations.controller";

export const locationRouter = new Hono();

locationRouter.get("/locations",listLocation );
locationRouter.get("/locations/:id", getLocation);
locationRouter.put("/locations/:id", updateLocation);
locationRouter.delete("/locations/:id", deleteLocation);
locationRouter.post("/locations", createLocation);