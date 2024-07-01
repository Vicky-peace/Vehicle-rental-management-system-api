import { Hono } from "hono";
import {listUsers,getUser,updateUser,deleteUser} from './users.controller';

export const userRouter = new Hono();

userRouter.get("/users", listUsers);
userRouter.get("/users/:id", getUser);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);