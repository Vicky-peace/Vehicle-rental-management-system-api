import {db} from "../drizzle/db";
import  {TIVehicleSpecifications,TSVehicleSpecifications,VehicleSpecifications} from '../drizzle/schema';
import {eq} from 'drizzle-orm';

export const vehicleService = async (limit?:number): Promise<TSVehicleSpecifications[] | null> => {
    if(limit){
        return await db.query.VehicleSpecifications.findMany({
            limit: limit
        });
    }
    return await db.query.VehicleSpecifications.findMany();

    }

export const getVehicleService = async (id: number): Promise<TSVehicleSpecifications | undefined> => {
    return await db.query.VehicleSpecifications.findFirst({
        where: eq(VehicleSpecifications.vehicle_id, id),
    }); 
}

export const updateVehicleService = async (id: number, vehicle: TIVehicleSpecifications) => {
    await db.update(VehicleSpecifications).set(vehicle).where(eq(VehicleSpecifications.vehicle_id, id)).execute();
    return 'Vehicle updated successfully';
}

export const deleteVehicleService = async (id: number) => {
    await db.delete(VehicleSpecifications).where(eq(VehicleSpecifications.vehicle_id, id)).execute();
    return 'Vehicle deleted successfully';
}
