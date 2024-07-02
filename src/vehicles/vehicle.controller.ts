import { Context } from "hono";
import { vehicleService, getVehicleService, updateVehicleService,deleteVehicleService,createVehicleService } from "./vehicle.service";


export const getAllVehicles = async (c:Context) =>{
    try {
        const limit = Number(c.req.query('limit'));
        const data = await vehicleService(limit);
        if(data == null || data.length == 0){
            return c.json({message: 'Vehicle not found'}, 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const getVehicle = async(c:Context) =>{
    try {
        const id = parseInt(c.req.param('id'));
        if(isNaN(id)) return c.text("Invalid ID", 400);
        const vehicle = await getVehicleService(id);
        if(vehicle == undefined){
            return c.json({message: 'Vehicle not found'}, 404);
        }
        return c.json(vehicle, 200);
    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}
export const updateVehicle = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    const vehicle = await c.req.json();
    try {
        //search the vehicle
        const searchVehicle = await getVehicleService(id);
        if(!searchVehicle){
            return c.json({message: 'Vehicle not found'}, 404);
        }
        //update vehicle
        const res = await updateVehicleService(id, vehicle);
        if(!res) return c.json({message: 'Vehicle not updated'}, 404);
        return c.json({message: res}, 200);
    } catch (error:any) {
        return c.json({error:error.message}, 400);
    }

}

export const createVehicle = async (c:Context) =>{
    const vehicle = await c.req.json();
    try {
        const data = await createVehicleService(vehicle);
        if(!data) return c.json({message: 'Vehicle not created'}, 404);
        return c.json({message: data}, 200);
    } catch (error:any) {
        return c.json({error:error.message}, 400);
    }
}


export const deleteVehicle = async (c:Context) =>{
    const id = parseInt(c.req.param('id')); 
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try {
        //search the vehicle
        const searchVehicle = await getVehicleService(id);
        if(!searchVehicle){
            return c.json({message: 'Vehicle not found'}, 404);
        }
        //delete the vehicle
        const res = await deleteVehicleService(id);
        if(!res) return c.json({message: 'Vehicle not deleted'}, 404);
        return c.json({message: res}, 200);
    } catch (error:any) {
        return c.json({error:error.message}, 400);
    }
}