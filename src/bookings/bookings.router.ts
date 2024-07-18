import { Hono } from "hono";
import { getAllBookings, getBooking, updateBooking, createBooking, deleteBooking,getUserWithBookingDetailsController,createBookingServiceController,updateBookingStatusController,cancelBookingController,getBookingsWithIdController,} from "./bookings.controller";
import { zValidator } from "@hono/zod-validator";
import { bookingSchema } from "../validator";
import { userRoleAuth,adminRoleAuth, adminOrUserAuth } from "../middleware/AuthorizeRole";

export const bookingRouter = new Hono();

bookingRouter.get('/bookings', getAllBookings);
bookingRouter.get('/bookings/:id', getBooking);
bookingRouter.put('/bookings/:id', zValidator('json', bookingSchema), updateBooking);
bookingRouter.put('/bookings/:id/status', updateBookingStatusController);
bookingRouter.post('/bookings', zValidator('json', bookingSchema), createBookingServiceController);
bookingRouter.delete('/bookings/:id', cancelBookingController);

bookingRouter.delete('/bookings/:id', deleteBooking);
// bookingRouter.get('/bookings/user/:id', getBookingsByUserId);
bookingRouter.get('/bookings/details', getUserWithBookingDetailsController);

bookingRouter.get('/bookings/users/:userId', getBookingsWithIdController)