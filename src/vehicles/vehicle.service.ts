import { TIVehicles,TSVehicles,Vehicles, VehicleSpecifications } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";

export const vehicleService = async (limit?:number): Promise<TSVehicles[] | null> => {
    if(limit){
        return await db.query.Vehicles.findMany({
            limit: limit
        });
    }
    return await db.query.Vehicles.findMany();
}

export const getVehicleService = async (id: number): Promise<TSVehicles | undefined> => {
    return await db.query.Vehicles.findFirst({
        where: eq(Vehicles.vehicleSpec_id, id),
    });
}


export const updateVehicleService = async (id: number, vehicle: TIVehicles) => {
    await db.update(Vehicles).set(vehicle).where(eq(Vehicles.vehicleSpec_id, id)).execute();
    return 'Vehicle updated successfully';
}

export const deleteVehicleService = async (id: number) => {
    await db.delete(Vehicles).where(eq(Vehicles.vehicleSpec_id, id)).execute();
    return 'Vehicle deleted successfully';
}

export const createVehicleService = async (vehicle: TIVehicles) => {
    await db.insert(Vehicles).values(vehicle).execute();
    return 'Vehicle created successfully';
}

//get vehicles together with their specifications   
 export const getVehicleDetails = async (limit?: number): Promise<TSVehicles[]> => {
    if(limit){
        await db.query.Vehicles.findMany({
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
                    },
                },
            },
            columns: {
                rental_rate: true,
                availability: true,
                vehicle_image: true
            },
            limit: limit
        });

    }
    return await db.query.Vehicles.findMany();
}