import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { TSBookings,TIBookings, Bookings } from "../drizzle/schema";

export const bookingService = async (limit?:number): Promise<TSBookings[] | null> => {
    if(limit){
        return await db.query.Bookings.findMany({
            limit: limit
        });
    }
    return await db.query.Bookings.findMany();
}

export const getBookingsService = async (id: number): Promise<TSBookings | undefined> => {
    return await db.query.Bookings.findFirst({
        where: eq(Bookings.booking_id, id),
    });
}

export const updateBookingService = async (id: number, booking: TIBookings) => {
    await db.update(Bookings).set(booking).where(eq(Bookings.booking_id, id)).execute();
    return 'Booking updated successfully';
}

export const createBookingsService = async (booking: TIBookings) => {
    await db.insert(Bookings).values(booking).execute();
    return 'Booking created successfully';
}

export const deleteBookingsService = async (id: number) => {
    await db.delete(Bookings).where(eq(Bookings.booking_id, id)).execute();
    return 'Booking deleted successfully';
}