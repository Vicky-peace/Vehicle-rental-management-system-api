import { Context } from "hono";
import { createPaymentService,getPaymentByBookingService, updatePaymentService,deletePaymentService, updatePaymentSessionIdService} from "./payments.service";
import { stripe } from "../drizzle/db";
import Stripe from "stripe";
import { ClientURL } from "../utils/utils";
import "dotenv/config";

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

//Create a checkout session
export const createCheckoutSessionController = async (c:Context) =>{
    let booking;
   try {
    booking = await c.req.json();

   } catch (error: any) {
     return c.json({message: "Booking not found"}, 404);
   }
   try {
    if(!booking.booking_id) return c.json({message: "Booking ID is Required"}, 404);

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
        price_data: {
            currency: 'usd',
            product_data: {
                name:  'Car Rental',
            },
            unit_amount: Math.round(booking.total_amount * 100), //convert to cents
        },
        quantity: 1,
    }];
    //checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: `${ClientURL}/payment-successful`, 
        cancel_url: `${ClientURL}/payment-failed`,
    };  
    const session: Stripe.Checkout.Session =await stripe.checkout.sessions.create(sessionParams);
    console.log(`Checkout Session URL : ${session.url}`);


    //save the payments to the db
    const paymentDetails = {
        booking_id: booking.booking_id,
        amount: booking.total_amount.toString(),
        user_id: booking.user_id,
        payment_date: new Date(),
        payment_method: 'card',
        transaction_id: session.id,
    };

    const createPayment = await createPaymentService(paymentDetails);
    return c.json({sessionId: session.id, url: session.url, payment: createPayment}, 200);
   } catch (error: any) {
     return c.json({message: error.message}, 400);
   }
}


//Webhook
export const handleStripeWebhook = async (c:Context) =>{
    const sig = c.req.header('stripe-signature');
    const rawBody = await c.req.text();
    if(!sig){
        console.log('Signature not provided');
        return c.json({message:'Invalid Signature'}, 400);
    }
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_ENDPOINT_SECRET as string);
    } catch (error: any) {
        console.log("Error", error.message);
        return c.json({ message: `WebHook Error: ${error.message}` }, 400);
    }

    //handling the event
    switch(event.type){
        case 'checkout.session.completed':
            const session = event.data.object as Stripe.Checkout.Session;

            //update the payment
            try {
               const session_id = session.id;
               const updateStatus = await  updatePaymentSessionIdService(session_id); 
               return c.json({message: updateStatus}, 200);
            } catch (error: any) {
                return c.json({ message: `Database Error ${error.message}` }, 500);
            }

            //handle other events
        default:
            console.log(`Unhandled event type ${event.type}`);
            return c.json({ message: `Unhandled event type ${event.type}` }, 200);
    }
}