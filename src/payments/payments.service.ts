import { db } from "../drizzle/db";
import { TSPayments, TIPayments, Payments } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import "dotenv/config";
import { stripe } from "../drizzle/db";

export const createPaymentService = async (payment: TIPayments) => {
    await db.insert(Payments).values(payment).execute();
    return 'Payment created successfully';

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