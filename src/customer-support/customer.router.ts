import { Hono } from "hono";
import { getAllCustomerSupport, getCustomerSupport, updateCustomerSupport, createCustomerSupport,deleteCustomerSupport } from "./customer.controller";
import { zValidator } from "@hono/zod-validator";
import { customerSupportSchema } from "../validator";
import { userRoleAuth,adminRoleAuth, adminOrUserAuth } from "../middleware/AuthorizeRole";

export const customerRouter = new Hono();

customerRouter.get('/customer-support', getAllCustomerSupport);
customerRouter.get('/customer-support/:id', getCustomerSupport);
customerRouter.put('/customer-support/:id', zValidator('json',customerSupportSchema),updateCustomerSupport);
customerRouter.post('/customer-support', zValidator('json',customerSupportSchema),createCustomerSupport);
customerRouter.delete('/customer-support/:id', deleteCustomerSupport);