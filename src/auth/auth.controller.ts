import { Context } from "hono";
import { registerUser,loginUser } from "./auth.service";


export const register = async (c:Context) =>{
    try {
        const user  = await c.req.json();
        const message = await registerUser(user);
        return c.json({msg:message}, 201);
    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const login = async (c:Context) =>{
    try {
        const {email,password} = await c.req.json();
        const {token,user} = await loginUser(email,password);
        return c.json({token,user}, 200);
    } catch (error:any) {
        return c.json({error:error.message}, 400);
    }
}