import { Context } from "hono";
import { fleetService, getFleetService, updateFleetService,deleteFleetService,createFleetService } from "./fleet.service";
import { parse } from "path";

export const getAllFleet = async(c:Context) =>{
    try {
        const limit = Number(c.req.query('limit'));
        const data = await fleetService(limit);
        if(data == null || data.length == 0){
            return c.json({message: 'Fleet not found'}, 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({message: error.message}, 500);
    }
}

export const getFleet = async(c:Context) =>{
    try {
        const id = parseInt(c.req.param('id'));
        if(isNaN(id)) return c.text("Invalid ID", 400);
        const fleet = await getFleetService(id);
        if(fleet == undefined){
            return c.json({message: 'Fleet not found'}, 404);
        }
        return c.json(fleet, 200);
    } catch (error: any) {
        return c.json({message: error.message}, 500);
    }
}

export const updateFleet = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    const fleet = await c.req.json();
    try {
         //convert date strings to date objects
         if(fleet.acquisition_date){
            fleet.acquisition_date = new Date(fleet.acquisition_date);
        }
        //search the fleet
        const searchFleet = await getFleetService(id);
        if(!searchFleet){
            return c.json({message: 'Fleet not found'}, 404);
        }

        //update fleet
        const res = await updateFleetService(id, fleet);
        if(!res) return c.json({message: 'Fleet not updated'}, 404);
        return c.json({message: res}, 200);
    } catch (error:any) {
        return c.json({message: error.message}, 500);
    }
}

export const createFleet = async(c:Context) =>{
    const fleet = await c.req.json();
    try {
        //convert date strings to date objects
        if(fleet.acquisition_date){
            fleet.acquisition_date = new Date(fleet.acquisition_date);
        }
          
        const data = await createFleetService(fleet);
        if(!data) return c.json({message: 'Fleet not created'}, 404);
        return c.json({message: data}, 200);
    } catch (error:any) {
        return c.json({message: error.message}, 500);
    }
}

export const deleteFleet = async(c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try {
        //search the fleet
        const searchFleet = await getFleetService(id);
        if(!searchFleet){
            return c.json({message: 'Fleet not found'}, 404);
        }

        //delete fleet
        const res = await deleteFleetService(id);
        if(!res) return c.json({message: 'Fleet not deleted'}, 404);
        return c.json({message: res}, 200);
    } catch (error:any) {
        return c.json({message: error.message}, 500);
    }
}