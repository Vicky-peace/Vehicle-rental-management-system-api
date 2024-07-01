import { TIUsers,TSUsers, Users } from "../drizzle/schema";
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


export const getUserService = async (id: number): Promise<TSUsers | undefined> => {
    return await db.query.Users.findFirst({
        where: eq(Users.user_id, id),
    });
}


export const updateuserService = async (id: number, user: TIUsers) => {
    await db.update(Users).set(user).where(eq(Users.user_id, id)).execute();
    return 'User updated successfully';
}

export const deleteUserService = async (id: number) => {
    await db.delete(Users).where(eq(Users.user_id, id)).execute();
    return 'User deleted successfully';
}