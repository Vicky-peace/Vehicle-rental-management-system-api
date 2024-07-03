import { date } from 'drizzle-orm/mysql-core';
import {z} from 'zod';

export const userSchema = z.object({
    user_id: z.number().int().optional(),
    full_name: z.string().max(255),
    email: z.string().email().max(255),
    contact_phone: z.string().max(20).optional().nullable(),
    address: z.string(),
    role: z.enum(["user", "admin"]).default("user"),
})

export const authSchema = z.object({
    auth_id: z.number().int().optional(),
    user_id: z.number().int().optional(),
    password: z.string().max(255),
})

export const loginSchema = z.object({
    email: z.string().email().max(255),
    password: z.string().max(255),
})

// Custom parser for date strings
const dateString = z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
}).transform((val) => new Date(val));
// Define the booking status enum
const bookingStatusEnum = z.enum(["Pending", "Confirmed", "Cancelled", "Completed"]);


export const vehicleSpecsSchema = z.object({
    vehicle_id: z.number().int().optional(),
    manufacturer: z.string().max(255),
    model: z.string().max(255),
    year: z.number().int().min(1900).max(2023),
    fuel_type: z.string().max(50),
    engine_capacity: z.string().max(50).optional().nullable(),
    transmission: z.string().max(50).optional().nullable(),
    seating_capacity: z.number().int().optional().nullable(),
    color: z.string().max(50).optional().nullable(),
    features: z.string().optional().nullable(),
})

export const bookingSchema = z.object({
    booking_id: z.number().int().optional(),
    user_id: z.number().int().positive(),
    vehicle_id: z.number().int().positive(),
    location_id: z.number().int().positive(),
    booking_date: z.string(),
    return_date: z.string(),
    total_amount: z.number().positive(),
    booking_status: bookingStatusEnum.default("Pending").optional(),
});

export type BookingSchema = z.infer<typeof bookingSchema>;
