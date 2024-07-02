import { Context } from "hono";
import { locationsService } from "./locations.service";

export const listLocation = async (c:Context) =>{
    try {
        const limit = Number(c.req.query('limit'));
        const data = await locationsService(limit);
        if(data == null || data.length == 0){
            return c.json({message: 'Location not found'}, 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}