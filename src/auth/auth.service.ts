import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../drizzle/db";
import { Users, Authentication } from "../drizzle/schema";
import { userSchema,authSchema, loginSchema } from "../validator";
import { eq } from "drizzle-orm";

const secret = process.env.SECRET;
const expiresIn = process.env.EXPIRESIN;

export const registerUser = async (user: any) => {
    userSchema.parse(user);
    authSchema.parse(user); 

    //check if user already exists
    const existingUser = await db.select().from(Users).where(eq(Users.email, user.email)).execute();

    if(existingUser.length > 0){
        throw new Error("User already exists");
    }

    //Hash the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    //inser data into the Users table
    const newUser = await db.insert(Users)
    .values({
        full_name: user.full_name,
        email: user.email,
        contact_phone: user.contact_phone,
        address: user.address,
        role: user.role
    })
    .returning({id: Users.user_id})
    .execute();

    //insert data into the Authentication table
    const userId = newUser[0].id;

    try {
        await db.insert(Authentication)
        .values({
            user_id: userId,
            password: hashedPassword
        })
        .execute();
        return 'User registered successfully';
    } catch (error) {
        // Rollback: delete the user from the Users table if the second insert fails
        await db.delete(Users).where(eq(Users.user_id, userId)).execute();
        throw new Error('Registration failed. Please try again.');
    }
}