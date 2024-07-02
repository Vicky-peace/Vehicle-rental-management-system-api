import { Context } from "hono";
import { locationsService,getLocationsService,updateLocationsService,deleteLocationsService,createLocationsService} from "./locations.service";
import { parse } from "path";

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

export const getLocation = async(c:Context) =>{
    try {
        const id = parseInt(c.req.param('id'));
        if(isNaN(id)) return c.text("Invalid ID", 400);

        const location = await getLocationsService(id);
        if(location == undefined){
            return c.json({message: 'Location not found'}, 404);
        }
        return c.json(location, 200);
    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const updateLocation = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    const location = await c.req.json();
    try {
        //search location
        const searchLocation = await locationsService(id);
        if(searchLocation == undefined){
            return c.json({message: 'Location not found'}, 404);
        }
        //update location
        const res = await updateLocationsService(id, location);
        if(!res) return c.json({message: 'Location not updated'}, 404);
        return c.json({message: res}, 200);
    } catch (error:any) {
        return c.json({error:error.message}, 400);
    }
}

export const createLocation = async (c:Context) =>{
    const location = await c.req.json();
    try {
        const res = await createLocationsService(location);
        if(!res) return c.json({message: 'Location not created'}, 404);
        return c.json({message: res}, 200);
    } catch (error:any) {
        return c.json({error:error.message}, 400);
    }
}


export const deleteLocation = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try {
        //search the location
        const searchLocation = await locationsService(id);
        if(searchLocation == undefined){
            return c.json({message: 'Location not found'}, 404);
        }

        //delete location
        const res = await deleteLocationsService(id);
        if(!res) return c.json({message: 'Location not deleted'}, 404);
        return c.json({message: res}, 200);
    } catch (error:any) {
        return c.json({error:error.message}, 400);
    }
}