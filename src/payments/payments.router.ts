import { Hono } from "hono";
import {createPaymentController,getPaymentByBookingController, updatePaymentController,deletePaymentController} from './payments.controller';

export const paymentsRouter = new Hono();

paymentsRouter.post('/payments', createPaymentController);
paymentsRouter.get('/payments/:booking_id', getPaymentByBookingController);
paymentsRouter.put('/payments/:id', updatePaymentController);
paymentsRouter.delete('/payments/:id', deletePaymentController);
