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