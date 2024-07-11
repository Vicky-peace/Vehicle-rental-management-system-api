import {db} from "../drizzle/db";
import  {TIVehicleSpecifications,TSVehicleSpecifications,VehicleSpecifications, Vehicles} from '../drizzle/schema';
import {eq} from 'drizzle-orm';

export const vehicleServiceSpecifications = async (limit?:number): Promise<TSVehicleSpecifications[] | null> => {
    if(limit){
        return await db.query.VehicleSpecifications.findMany({
            limit: limit
        });
    }
    return await db.query.VehicleSpecifications.findMany();

    }

export const getVehicleSpecificationsService = async (id: number): Promise<TSVehicleSpecifications | undefined> => {
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
            rental_rate: true,
            availability: true,
            vehicle_image: true,
        },
        with:{
            vehicleSpec: {
                columns:{
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