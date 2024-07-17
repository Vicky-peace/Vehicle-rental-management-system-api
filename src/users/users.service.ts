import { TIUsers,TSUsers, Users, Authentication } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { Context } from "hono";
import { userSchema, authSchema } from "../validator";
import bcrypt from "bcryptjs";

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

interface UpdateUserPayload {
    user_id: number;
    full_name: string;
    email: string;
    contact_phone: string;
    address: string;
    role?: 'user' | 'admin';
    profile_image: string;
    password: string;
}

export const updateUserDetails = async (user: UpdateUserPayload) =>{
    userSchema.parse(user);     
    if(user.password){
        authSchema.parse(user);
    }

    const userUpdateData: TIUsers = {
        full_name: user.full_name,
        email: user.email,
        contact_phone: user.contact_phone,
        address: user.address,
        role: user.role,
        profile_image: user.profile_image,
        updated_at: new Date(),
    };

    await db.update(Users)
    .set(userUpdateData)
    .where(eq(Users.user_id, user.user_id))
    .execute();

    if(user.password){
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await db.update(Authentication)
        .set({password: hashedPassword, updated_at: new Date()})
        .where(eq(Authentication.user_id, user.user_id))
        .execute();
    }
    return 'User updated successfully';

}