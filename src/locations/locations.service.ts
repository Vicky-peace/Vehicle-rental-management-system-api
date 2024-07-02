import { db } from "../drizzle/db";
import { eq } from "drizzle-orm";
import { LocationsAndBranches, TSLocationGAndBranches,TILocationsAndBranches } from "../drizzle/schema";
import { Context } from "hono";

export const locationsService = async (limit?:number): Promise<TSLocationGAndBranches[] | null> => {
    if(limit){
        return await db.query.LocationsAndBranches.findMany({
            limit: limit
        });
    }
    return await db.query.LocationsAndBranches.findMany();
}


export const getLocationsService = async (id: number): Promise<TSLocationGAndBranches | undefined> => {
    return await db.query.LocationsAndBranches.findFirst({
        where: eq(LocationsAndBranches.location_id, id),
    });
}    

export const updateLocationsService = async (id: number, location: TILocationsAndBranches) => {
    await db.update(LocationsAndBranches).set(location).where(eq(LocationsAndBranches.location_id, id)).execute();
    return 'Location updated successfully';
}


export const deleteLocationsService = async (id: number) => {
    await db.delete(LocationsAndBranches).where(eq(LocationsAndBranches.location_id, id)).execute();
    return 'Location deleted successfully';
}

export const createLocationsService = async (location: TILocationsAndBranches) => {
    await db.insert(LocationsAndBranches).values(location).execute();
    return 'Location created successfully';
}