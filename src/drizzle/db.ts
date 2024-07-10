import "dotenv/config";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from './schema';
import Stripe from "stripe";

const databaseUrl = process.env.DATABASE_URL as string;
if (!databaseUrl) throw new Error("DATABASE_URL is not set");

const sql = neon(databaseUrl);

export const db: NeonHttpDatabase<typeof schema> = drizzle(sql, { schema, logger: true });


export const stripe = new Stripe(process.env.STRIPE_SECRET as string,{
    apiVersion: '2024-06-20',
    typescript: true
});
