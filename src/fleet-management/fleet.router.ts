import { Hono } from "hono";
import { createFleet, getAllFleet,getFleet,deleteFleet,updateFleet } from "./fleet.controller";
import { zValidator } from "@hono/zod-validator";
import { fleetSchema } from "../validator";
import { userRoleAuth,adminRoleAuth, adminOrUserAuth } from "../middleware/AuthorizeRole";

export const fleetRouter = new Hono();

fleetRouter.get('/fleet',userRoleAuth, getAllFleet);
fleetRouter.get('/fleet/:id', getFleet);
fleetRouter.put('/fleet/:id', zValidator('json', fleetSchema), updateFleet);
fleetRouter.post('/fleet', zValidator('json', fleetSchema), createFleet);
fleetRouter.delete('/fleet/:id', deleteFleet);