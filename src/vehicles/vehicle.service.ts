import { TIVehicles,TSVehicles,Vehicles } from "../drizzle/schema";
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