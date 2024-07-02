import { Hono } from "hono";
import { listLocation} from "./locations.controller";

export const locationRouter = new Hono();

locationRouter.get("/locations",listLocation );