import { TIUsers,TSUsers } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { Context } from "hono";

export const userService = async (limit?:number): Promise<TSUsers[] | null> => {
    if(limit){
        return await db.query.Users.findMany({
            limit: limit
        });
    }
    return await db.query.Users.findMany();
}