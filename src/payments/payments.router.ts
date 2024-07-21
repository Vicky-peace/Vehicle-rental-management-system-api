import { Hono } from "hono";
import {getAllPaymentsController, createPaymentController,getPaymentByBookingController, updatePaymentController,deletePaymentController,createCheckoutSessionController} from './payments.controller';
import { userRoleAuth,adminRoleAuth, adminOrUserAuth } from "../middleware/AuthorizeRole";

export const paymentsRouter = new Hono();

paymentsRouter.get('/payments', getAllPaymentsController);
paymentsRouter.post('/payments',createPaymentController);
paymentsRouter.get('/payments/:booking_id', getPaymentByBookingController);
paymentsRouter.put('/payments/:id', updatePaymentController);
paymentsRouter.delete('/payments/:id', deletePaymentController);
paymentsRouter.post('/checkout-session', createCheckoutSessionController);
