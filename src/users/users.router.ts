import { Hono } from "hono";
import {listUsers,getUser,updateUser,deleteUser} from './users.controller';
import { userRoleAuth,adminRoleAuth, adminOrUserAuth } from "../middleware/AuthorizeRole";

export const userRouter = new Hono();

userRouter.get("/users",userRoleAuth, listUsers);
userRouter.get("/users/:id", getUser);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);