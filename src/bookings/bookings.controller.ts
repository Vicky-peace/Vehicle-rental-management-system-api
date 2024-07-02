import {Context} from "hono";
import { bookingService , getBookingsService, updateBookingService, deleteBookingsService, createBookingsService } from "./bookings.service";
import { bookingSchema } from "../validator";

export const getAllBookings = async (c:Context) =>{
    try {
        const limit = Number(c.req.query('limit'));
        const data = await bookingService(limit);
        if(data == null || data.length == 0){
            return c.json({message: 'Booking not found'}, 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({erorr: error.message}, 400);
    }
}

export const getBooking = async(c:Context) =>{
    try {
        const id = parseInt(c.req.param('id'));
        if(isNaN(id)) return c.text("Invalid ID", 400);

        const booking = await getBookingsService(id);
        if(!booking){
            return c.json({message: 'Booking not found'}, 404);
        }
        return c.json(booking, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
    }
}

export const updateBooking = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    const booking = await c.req.json();
    try {
        //search booking
        const searchBooking = await getBookingsService(id);
        if(!searchBooking){
            return c.json({message: 'Booking not found'}, 404);
        }

        //update location
        const res = await updateBookingService(id, booking);
        if(!res) return c.json({message: 'Booking not updated'}, 404);
        return c.json({message: res}, 200);
    } catch (error:any) {
        return c.json({error: error.message}, 400);
    }
}

export const createBooking = async (c:Context) =>{
    const booking = await c.req.json();
    try {
        const data = await createBookingsService(booking);
        if(!data) return c.json({message: 'Booking not created'}, 404);
        return c.json({message: data}, 200);
    } catch (error:any) {
        return c.json({error: error.message}, 400);
    }
}

export const deleteBooking = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try {
        //search booking
        const searchBooking = await getBookingsService(id);
        if(!searchBooking){
            return c.json({message: 'Booking not found'}, 404);
        }
        //delete booking
        const res = await deleteBookingsService(id);
        if(!res) return c.json({message: 'Booking not deleted'}, 404);
        return c.json({message: res}, 200);
    } catch (error:any) {
        return c.json({error: error.message}, 400)
    }
}