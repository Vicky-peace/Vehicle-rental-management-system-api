import {db} from "../drizzle/db";
import  {TIVehicleSpecifications,TIVehicles,TSVehicleSpecifications,VehicleSpecifications, Vehicles} from '../drizzle/schema';
import {eq} from 'drizzle-orm';
import { z } from "zod";

export const vehicleServiceSpecifications = async (limit?:number): Promise<TSVehicleSpecifications[] | null> => {
    if(limit){
        return await db.query.VehicleSpecifications.findMany({
            limit: limit
        });
    }
    return await db.query.VehicleSpecifications.findMany();

    }

export const getVehicleSpecificationsService: (id: number) => Promise<TSVehicleSpecifications | undefined> = async (id) => {
    return await db.query.VehicleSpecifications.findFirst({
        where: eq(VehicleSpecifications.vehicle_id, id),
    }); 
}

export const updateVehicleSpecificationsService = async (id: number, vehicle: TIVehicleSpecifications) => {
    await db.update(VehicleSpecifications).set(vehicle).where(eq(VehicleSpecifications.vehicle_id, id)).execute();
    return 'Vehicle updated successfully';
}

export const deleteVehicleSpecificationsService = async (id: number) => {
    await db.delete(VehicleSpecifications).where(eq(VehicleSpecifications.vehicle_id, id)).execute();
    return 'Vehicle deleted successfully';
}

export const createVehicleSpecificationsService = async (vehicle: TIVehicleSpecifications) => {
    await db.insert(VehicleSpecifications).values(vehicle).execute();
    return 'VehicleSpecifications created successfully';
}

export const getVehicleWithSpecs = async () => {
    return await db.query.Vehicles.findMany({
        columns:{
            vehicle_id: true,
            vehicleSpec_id: true,
            rental_rate: true,
            availability: true,
            vehicle_image: true,
        },
        with:{
            vehicleSpec: {
                columns:{
                    vehicle_id: true,
                    manufacturer: true,
                    model: true,
                    year: true,
                    fuel_type: true,
                    engine_capacity: true,
                    transmission: true,
                    seating_capacity: true,
                    color: true,
                    features: true,
                }
            }
        }
    });

}


// Service to get a vehicle with its specifications by ID
export const getVehicleWithSpecsById = async (vehicleId: number) => {
    const result = await db.query.Vehicles.findMany({
        where: eq(Vehicles.vehicleSpec_id, vehicleId),
        columns: {
            vehicle_id: true,
            rental_rate: true,
            availability: true,
            vehicle_image: true,
        },
        with: {
            vehicleSpec: {
                columns: {
                    manufacturer: true,
                    model: true,
                    year: true,
                    fuel_type: true,
                    engine_capacity: true,
                    transmission: true,
                    seating_capacity: true,
                    color: true,
                    features: true,
                }
            }
        }
    });

    if (result.length === 0) {
        throw new Error("Vehicle not found");
    }

    return result[0];
}


//create a veicle and its specs
// Define the schema for validation
const vehicleSpecSchema = z.object({
    manufacturer: z.string(),
    model: z.string(),
    year: z.number(),
    fuel_type: z.string(),
    engine_capacity: z.string().optional(),
    transmission: z.string().optional(),
    seating_capacity: z.number().optional(),
    color: z.string().optional(),
    features: z.string().optional()
  });
  
  const vehicleSchema = z.object({
    rental_rate: z.number(),
    availability: z.boolean().optional(),
    vehicle_image: z.string().optional()
  });
  
 // Service to insert data into both tables
 export const createVehicleWithSpecification = async (vehicleSpec: TIVehicleSpecifications, vehicle: TIVehicles) => {
    console.log('Vehicle Spec:', vehicleSpec);
    console.log('Vehicle:', vehicle);
  
    // Validate the input data
    vehicleSpecSchema.parse(vehicleSpec);
    vehicleSchema.parse(vehicle);
  
    // Insert data into the vehicle_specifications table
    const newVehicleSpec = await db.insert(VehicleSpecifications)
      .values(vehicleSpec)
      .returning({ id: VehicleSpecifications.vehicle_id })
      .execute();
  
    const vehicleSpecId = newVehicleSpec[0].id;
  
    // Insert data into the vehicles table
    try {
      await db.insert(Vehicles)
        .values({
          vehicle_id: vehicleSpecId,
          rental_rate: vehicle.rental_rate,
          availability: vehicle.availability,
          vehicle_image: vehicle.vehicle_image,
        })
        .execute();
  
      return 'Vehicle with specifications created successfully';
    } catch (error) {
      // Rollback: delete the vehicle_specification if the second insert fails
      await db.delete(VehicleSpecifications).where(eq(VehicleSpecifications.vehicle_id, vehicleSpecId)).execute();
      throw new Error('Creation failed. Please try again.');
    }
  };
  

  export const updateVehicleWithSpecification = async (vehicleSpec: TIVehicleSpecifications, vehicle: TIVehicles, vehicleSpecId: number) => {
    console.log('Vehicle Spec:', vehicleSpec);
    console.log('Vehicle:', vehicle);
    
    // Validate the input data
    vehicleSpecSchema.parse(vehicleSpec);
    vehicleSchema.parse(vehicle);
  
    // Update data in the vehicle_specifications table
    try {
      await db.update(VehicleSpecifications)
        .set(vehicleSpec)
        .where(eq(VehicleSpecifications.vehicle_id, vehicleSpecId))
        .execute();
    
      // Update data in the vehicles table
      await db.update(Vehicles)
        .set({
          rental_rate: vehicle.rental_rate,
          availability: vehicle.availability,
          vehicle_image: vehicle.vehicle_image,
        })
        .where(eq(Vehicles.vehicle_id, vehicleSpecId))
        .execute();
    
      return 'Vehicle with specifications updated successfully';
    } catch (error) {
      console.error('Update failed:', error);
      throw new Error('Update failed. Please try again.');
    }
  };