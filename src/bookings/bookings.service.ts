import { eq, and, or } from "drizzle-orm";
import { db } from "../drizzle/db";
import {
  TSBookings,
  TIBookings,
  Bookings,
  Users,
  Vehicles,
} from "../drizzle/schema";

export const bookingService = async (
  limit?: number
): Promise<TSBookings[] | null> => {
  if (limit) {
    return await db.query.Bookings.findMany({
      limit: limit,
    });
  }
  return await db.query.Bookings.findMany();
};

export const getBookingsService = async (
  id: number
): Promise<TSBookings | undefined> => {
  return await db.query.Bookings.findFirst({
    where: eq(Bookings.booking_id, id),
  });
};

export const updateBookingService = async (id: number, booking: TIBookings) => {
  await db
    .update(Bookings)
    .set(booking)
    .where(eq(Bookings.booking_id, id))
    .execute();
  return "Booking updated successfully";
};

export const createBookingsService = async (booking: TIBookings) => {
  await db.insert(Bookings).values(booking).execute();
  return "Booking created successfully";
};

export const deleteBookingsService = async (id: number) => {
  await db.delete(Bookings).where(eq(Bookings.booking_id, id)).execute();
  return "Booking deleted successfully";
};

//get booking by user_id
export const getBookingsByUserIdService = async (
  id: number
): Promise<TSBookings[] | undefined> => {
  return await db.query.Bookings.findMany({
    where: eq(Bookings.user_id, id),
  });
};

//Check for overlapping bookings
const checkForOverlappingBookings = async (
  vehicleId: number,
  startDate: Date,
  endDate: Date
): Promise<boolean> => {
  const overlappingBookings = await db.query.Bookings.findMany({
    where: and(
      eq(Bookings.vehicle_id, vehicleId),
      or(
        and(
          eq(Bookings.booking_date, startDate),
          eq(Bookings.return_date, endDate)
        ),
        and(
          eq(Bookings.booking_date, endDate),
          eq(Bookings.return_date, startDate)
        )
      )
    ),
  });
  return overlappingBookings.length > 0;
};

// Create a booking with validation
export const createBookingService = async (
  booking: TIBookings
): Promise<TSBookings> => {
  // Ensure vehicle_id is not undefined or null
  if (booking.vehicle_id == null) {
    throw new Error("Vehicle ID must be provided");
  }

  // Date validation
  if (new Date(booking.booking_date) >= new Date(booking.return_date)) {
    throw new Error("Booking date must be before return date");
  }

  // Overlap checking
  const isOverlapping = await checkForOverlappingBookings(
    booking.vehicle_id,
    new Date(booking.booking_date),
    new Date(booking.return_date)
  );
  if (isOverlapping) {
    throw new Error("The vehicle is already booked for the selected dates");
  }

  // Save booking to the database
  try {
    const result = await db
      .insert(Bookings)
      .values(booking)
      .returning()
      .execute();

    // Log the result for debugging purposes
    console.log("Booking insertion result:", result);

    return result[0] as TSBookings;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error("Booking creation failed");
  }
};

type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed"
  | null
  | undefined;

// Additional logic for updating status, cancellations, etc.
export const updateBookingStatusService = async (
  bookingId: number,
  status: BookingStatus
): Promise<void> => {
  await db
    .update(Bookings)
    .set({ booking_status: status })
    .where(eq(Bookings.booking_id, bookingId))
    .execute();
};

export const cancelBookingService = async (
  bookingId: number
): Promise<void> => {
  await db
    .update(Bookings)
    .set({ booking_status: "Cancelled" })
    .where(eq(Bookings.booking_id, bookingId))
    .execute();
};

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
