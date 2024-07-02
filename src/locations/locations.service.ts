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