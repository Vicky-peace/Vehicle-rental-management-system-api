import { eq } from "drizzle-orm";
import { db } from "../drizzle/db";
import { TSFleetManagement,TIFleetManagement,FleetManagement } from "../drizzle/schema";


export const fleetService = async (limit?:number): Promise<TSFleetManagement[] | null> => {
    if(limit){
        return await db.query.FleetManagement.findMany({
            limit: limit
        });
    }
    return await db.query.FleetManagement.findMany();
}

export const getFleetService = async (id: number): Promise<TSFleetManagement | undefined> => {
    return await db.query.FleetManagement.findFirst({
        where: eq(FleetManagement.fleet_id, id),
    });
}

export const updateFleetService = async (id: number, fleet: TIFleetManagement) => {
    await db.update(FleetManagement).set(fleet).where(eq(FleetManagement.fleet_id, id)).execute();
    return 'Fleet updated successfully';
}

export const createFleetService = async (fleet: TIFleetManagement) => {
    await db.insert(FleetManagement).values(fleet).execute();
    return 'Fleet created successfully';
}

export const deleteFleetService = async (id: number) => {
    await db.delete(FleetManagement).where(eq(FleetManagement.fleet_id, id)).execute();
    return 'Fleet deleted successfully';
}