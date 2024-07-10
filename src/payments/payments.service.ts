import { db } from "../drizzle/db";
import { TSPayments, TIPayments, Payments } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import "dotenv/config";
import { stripe } from "../drizzle/db";

export const createPaymentService = async (payment: TIPayments) => {
    if (payment.booking_id === undefined) {
        throw new Error("Booking ID is required");
    }
    //create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(payment.amount) * 100,
        currency: 'usd',
        metadata: { booking_id: payment.booking_id },
    });

    //Save payment details to the database
    await db.insert(Payments).values({
        booking_id: payment.booking_id,
        amount: payment.amount,
        payment_status: 'Pending',
        payment_method: payment.payment_method,
        transaction_id: paymentIntent.id,
        payment_date: new Date(),
    }).execute();
    
    return { message: 'Payment created successfully', client_secret: paymentIntent.client_secret };
}


export const getPaymentByBookingService = async (booking_id: number) => {
    return await db.query.Payments.findFirst({
        where: eq(Payments.booking_id, booking_id),
    });
}

export const updatePaymentService = async (id: number, payment: TIPayments) =>{
    await db.update(Payments).set(payment).where(eq(Payments.payment_id, id)).execute();
    return 'Payment updated successfully';
}

export const deletePaymentService = async (id: number) => {
    await db.delete(Payments).where(eq(Payments.payment_id, id)).execute();
    return 'Payment deleted successfully';
}