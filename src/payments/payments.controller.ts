import { Context } from "hono";
import { createPaymentService,getPaymentByBookingService, updatePaymentService,deletePaymentService} from "./payments.service";


export const createPaymentController = async (c:Context) =>{
    try {
        const payment = await c.req.json();
        const result = await createPaymentService(payment);
        return c.json(result, 201);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
    }
}

export const getPaymentByBookingController = async (c:Context) =>{
    try {
        const {booking_id} = c.req.param();
        const payment = await getPaymentByBookingService(parseInt(booking_id));
        if(!payment){
            return c.json({message: 'Payment not found'}, 404);
        }
        return c.json(payment, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
    }
}

export const updatePaymentController = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    const payment = await c.req.json();
    try {
        //search
        const searchpayment = await getPaymentByBookingService(id);
        if(!searchpayment){
            return c.json({message: 'Payment not found'}, 404);
        }
        //update payment
        const result = await updatePaymentService(id, payment);
        if(!result) return c.json({message: 'Payment not updated'}, 404);
        return c.json({message: result}, 200);
    } catch (error:any) {
        return c.json({error: error.message}, 400);
    }
}


export const deletePaymentController = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));     
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try {
        //seach payment
        const searchpayment = await getPaymentByBookingService(id);
        if(!searchpayment){
            return c.json({message: 'Payment not found'}, 404);
        }
        //delete payment
        const result = await deletePaymentService(id);
        return c.json({message: result}, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
    }
}