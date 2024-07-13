import { Context } from "hono";
import { vehicleServiceSpecifications, getVehicleSpecificationsService, updateVehicleSpecificationsService, deleteVehicleSpecificationsService,createVehicleSpecificationsService, getVehicleWithSpecs,getVehicleWithSpecsById,createVehicleWithSpecification} from "./vehicleSpecifiactions.service";

export const getAllVehicles = async (c:Context) =>{
    try {
        const limit = Number(c.req.query('limit'));

        const data = await vehicleServiceSpecifications(limit);
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

        const vehicle = await getVehicleSpecificationsService(id);
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
        const searchVehicle = await getVehicleSpecificationsService(id);
        if(searchVehicle == undefined){
            return c.json({message: 'Vehicle not found'}, 404);
        }
        //update vehicle
        const res = await updateVehicleSpecificationsService(id, vehicle);
        
        if(!res) return c.json({message: 'Vehicle not updated'}, 404);  
        
        return c.json({message: res}, 200);

    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const deleteVehicle = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try {
        //search the vehicle
        const searchVehicle = await getVehicleSpecificationsService(id);
        if(searchVehicle == undefined){
            return c.json({message: 'Vehicle not found'}, 404);
        }
        //delete vehicle
        const res = await deleteVehicleSpecificationsService(id);
        
        if(!res) return c.json({message: 'Vehicle not deleted'}, 404);  
        
        return c.json({message: res}, 200);

    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const createVehicle = async (c:Context) =>{
    try {
        const data = await c.req.json();
        const vehicleSpecs = await  createVehicleSpecificationsService(data);
        if(!vehicleSpecs) return c.json({message: 'Vehicle specs not created'}, 404);
       
        return c.json({message: 'Vehicle specs created successfully'}, 201);
        
    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const getVehicleWithSpecController = async (c:Context) =>{
    try {
        const data = await getVehicleWithSpecs();
        if(!data || data.length == 0) return c.json({message: 'Vehicle not found'}, 404);
        return c.json(data, 200);
    } catch (error: any) {
       return c.json({error:error.message}, 400); 
    }
}

export const getVehicleWithSpecsByIdController = async (c:Context) => {
    try {
        const vehicleId = parseInt(c.req.param('id'));
        if(isNaN(vehicleId)) return c.text("Invalid ID", 400);
        const data = await getVehicleWithSpecsById(vehicleId);
        if(!data) return c.json({message: 'Vehicle not found'}, 404);
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}


export const createVehicleWithSpecController = async (c: Context) => {
    try {
      const { vehicleSpec, vehicle } = await c.req.json();
  
      // Validate the incoming data here if necessary
  
      const result = await createVehicleWithSpecification(vehicleSpec, vehicle);
      return c.json(result, 201);
    } catch (error: any) {
      console.error("Error in createVehicleWithSpecController:", error);
      return c.json({ error: error.message }, 500);
    }
  };