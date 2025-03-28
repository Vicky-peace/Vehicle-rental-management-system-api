import { Hono } from "hono";
import {listUsers,getUser,updateUser,deleteUser, updateUserDetailsController} from './users.controller';
import { userRoleAuth,adminRoleAuth, adminOrUserAuth } from "../middleware/AuthorizeRole";

export const userRouter = new Hono();

userRouter.get("/users", listUsers);
userRouter.get("/users/:id", getUser);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);
userRouter.put("/users/:user_id", updateUserDetailsController);