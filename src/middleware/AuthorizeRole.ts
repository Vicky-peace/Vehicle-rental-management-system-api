import "dotenv/config";
import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import jwt from "jsonwebtoken";



interface HonoRequest<T, U> {
    user?: T;
    // Add other properties if needed
}

export const verifyToken = async (token: string, secret: string) => {
    try{
        const decoded = jwt.verify(token as string, secret!);
        return decoded;

    } catch(error: any){
        throw new Error("Invalid token");
    }
}




export const authMiddleware = async (c: Context & {req: HonoRequest<any,unknown>}, next: Next, requiredRole:  string) => {
   
        const headers = c.req.header();
        console.log('Headers:', headers);
    const token = c.req.header("token");
    

    if (!token) {
        console.log("No token provided");
        return c.json({ error: 'Unauthorized: No token provided' }, 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET as string) as any;

        if (!decoded) {
            console.log("Token verification failed");
            return c.json({ error: "Forbidden" }, 403);
        }

 
        if(requiredRole === 'both'){
            return  next();
        }

        if (decoded.role !== requiredRole) {
            return c.json({ error: "Unauthorized: Invalid role" }, 401);
           }
           
        console.log("Token and role verified successfully");
        c.set('user', decoded);
        await next();
    } catch (error) {
        console.log("Error verifying token:", error);
        return c.json({ error: "Unauthorized Invalid token" }, 401);
    }
};

export const adminRoleAuth = async (c: Context, next: Next) =>  await authMiddleware(c, next, "admin");
export const userRoleAuth = async (c: Context, next: Next) =>  await authMiddleware(c, next, "user");
export const adminOrUserAuth = async (c: Context, next: Next) => await authMiddleware(c, next, "both");