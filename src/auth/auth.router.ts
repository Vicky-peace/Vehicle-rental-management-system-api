import { Hono } from "hono";
import { register } from "./auth.controller";  


export const authRouter = new Hono();

authRouter.post("/register", register);
