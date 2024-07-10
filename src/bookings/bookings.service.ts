import {eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { TSBookings,TIBookings, Bookings } from "../drizzle/schema";
import {Users,VehicleSpecifications,LocationsAndBranches} from "../drizzle/schema";
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

//get booking by user_id
export const getBookingsByUserIdService = async (id: number): Promise<TSBookings[] | undefined> => {
    return await db.query.Bookings.findMany({
        where: eq(Bookings.user_id, id),
    });
}

//get user with booking details
export const getUserWithBookingDetails = async () => {
    return await db.query.Bookings.findMany({
      columns: {
        booking_date: true,
        return_date: true,
        total_amount: true,
        booking_status: true,
      },
      with: {
        vehicle: {
          columns: {
          vehicle_id: true,
          },
          with: {
            vehicleSpec: {
              columns: {
               manufacturer: true,
              },
            },
          },
        },
        location: {
          columns: {
            name: true,
          },
        },
      },
    });
  };
  

//other business logic
// import { Bookings, Payments } from '../models/BookingModel';
// import { Transaction } from 'drizzle-orm';

// export const bookVehicle = async (
//     userId: number,
//     vehicleId: number,
//     startDate: Date,
//     endDate: Date,
//     paymentMethod: string
// ) => {
//     const isAvailable = await checkVehicleAvailability(vehicleId, startDate, endDate);
//     if (!isAvailable) {
//         return { success: false, message: 'Vehicle is not available for the selected dates' };
//     }

//     // Transaction begins
//     const transaction = await Bookings.$transaction(async (trans: Transaction) => {
//         const booking = await Bookings.$query(trans).insert({
//             user_id: userId,
//             vehicle_id: vehicleId,
//             booking_date: startDate,
//             return_date: endDate,
//             booking_status: 'Pending',
//             total_amount: calculateRentalCost(vehicleId, startDate, endDate)
//         });

//         await Payments.$query(trans).insert({
//             booking_id: booking.booking_id,
//             amount: booking.total_amount,
//             payment_status: 'Pending',
//             payment_method: paymentMethod
//         });

//         return booking;
//     });

//     return { success: true, booking: transaction };
// };

// export const checkVehicleAvailability = async (
//     vehicleId: number,
//     startDate: Date,
//     endDate: Date
// ) => {
//     const bookings = await Bookings.$query()
//         .where('vehicle_id', vehicleId)
//         .andWhere('booking_status', '!=', 'Cancelled')
//         .andWhereRaw('NOT (return_date <= ? OR booking_date >= ?)', [startDate, endDate]);

//     return bookings.length === 0; // True if no overlapping bookings
// };

// export const calculateRentalCost = (
//     vehicleId: number,
//     startDate: Date,
//     endDate: Date
// ) => {
//     const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
//     const ratePerDay = 100; // This would ideally come from the vehicle's data
//     return days * ratePerDay;
// };



//controller
// import { Context } from 'hono';
// import { bookVehicle, checkVehicleAvailability } from './BookingService';

// export const bookVehicleHandler = async (c: Context) => {
//     const { userId, vehicleId, startDate, endDate, paymentMethod } = await c.req.json();
//     try {
//         const result = await bookVehicle(userId, vehicleId, new Date(startDate), new Date(endDate), paymentMethod);
//         if (result.success) {
//             return c.json(result, 200);
//         } else {
//             return c.json(result, 400);
//         }
//     } catch (error) {
//         return c.json({ message: 'Internal server error', details: error.message }, 500);
//     }
// };

// export const checkAvailabilityHandler = async (c: Context) => {
//     const vehicleId = Number(c.req.query('vehicleId'));
//     const startDate = new Date(c.req.query('startDate'));
//     const endDate = new Date(c.req.query('endDate'));
//     try {
//         const available = await checkVehicleAvailability(vehicleId, startDate, endDate);
//         return c.json({ available }, 200);
//     } catch (error) {
//         return c.json({ message: 'Internal server error', details: error.message }, 500);
//     }
// };




//router
// import { Hono } from 'hono';
// import { bookVehicleHandler, checkAvailabilityHandler } from './BookingController';

// const bookingRouter = new Hono();

// bookingRouter.post('/book', bookVehicleHandler);
// bookingRouter.get('/check-availability', checkAvailabilityHandler);

// export default bookingRouter;
