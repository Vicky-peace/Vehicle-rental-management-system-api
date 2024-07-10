import {Context} from "hono";
import { bookingService , getBookingsService, updateBookingService, deleteBookingsService, createBookingsService,getBookingsByUserIdService,getUserWithBookingDetails,createBookingService, updateBookingStatusService, cancelBookingService} from "./bookings.service";
import { TIBookings } from "../drizzle/schema";


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

          //convert date strings to date objects
          if(booking.booking_date){
            booking.booking_date = new Date(booking.booking_date);
        }
        if(booking.return_date){
            booking.return_date = new Date(booking.return_date);
        }
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
    try {
        const booking = await c.req.json();
        //convert date strings to date objects
        if(booking.booking_date){
            booking.booking_date = new Date(booking.booking_date);
        }
        if(booking.return_date){
            booking.return_date = new Date(booking.return_date);
        }
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

export const getBookingsByUserId = async (c:Context) =>{
    try {
        const id = parseInt(c.req.param('id'));
        if(isNaN(id)) return c.text("Invalid ID", 400);

        const bookings = await getBookingsByUserIdService(id);
        if(!bookings){
            return c.json({message: 'Booking not found'}, 404);
        }
        return c.json(bookings, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
    }

}

//checks for overlapping bookings

export const createBookingServiceController = async (c: Context) => {
    try {
        const booking: TIBookings = await c.req.json();
        //convert date strings to date objects
        if(booking.booking_date){
            booking.booking_date = new Date(booking.booking_date);
        }
        if(booking.return_date){
            booking.return_date = new Date(booking.return_date);
        }

      
        const newBooking = await createBookingService(booking);
        return c.json(newBooking, 201);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }

}


export const updateBookingStatusController = async (c: Context) => {
    try {
       const {id} = c.req.param();
       const {status} = await c.req.json();
       await updateBookingStatusService(parseInt(id), status);
       return c.json({ message: 'Booking status updated' }, 200);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
}

export const cancelBookingController = async (c: Context) => {
    try {
        const {id} = c.req.param();
        await cancelBookingService(parseInt(id));
        return c.json({ message: 'Booking cancelled' }, 200);
    } catch (error: any) {
        return c.json({ error: error.message }, 400);
    }
}


//get user with booking details
export const getUserWithBookingDetailsController = async (c: Context) => {
    try {
      const data = await getUserWithBookingDetails();
      console.log(data); 
      if (!data || data.length === 0) {
        return c.json({ message: 'Booking not found' }, 404);
      }
      return c.json(data, 200);
    } catch (error: any) {
      console.error('Error fetching booking details:', error);   
      return c.json({ error: error.message }, 400);
    }
  };
  