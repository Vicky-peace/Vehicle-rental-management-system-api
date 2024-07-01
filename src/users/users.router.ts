import { Hono } from "hono";
import {listUsers} from './users.controller';

export const userRouter = new Hono();

userRouter.get("/users", listUsers);