import { Hono } from "hono";
import { getAllBookings, getBooking, updateBooking, createBooking, deleteBooking } from "./bookings.controller";
import { zValidator } from "@hono/zod-validator";
import { bookingSchema } from "../validator";

export const bookingRouter = new Hono();

bookingRouter.get('/bookings', getAllBookings);
bookingRouter.get('/bookings/:id', getBooking);
bookingRouter.put('/bookings/:id', zValidator('json', bookingSchema), updateBooking);
bookingRouter.post('/bookings', zValidator('json', bookingSchema), createBooking);
bookingRouter.delete('/bookings/:id', deleteBooking);
