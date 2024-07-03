import { eq } from "drizzle-orm";
import { db } from "../drizzle/db"; 
import { TSCustomerSupportTickets, TICustomerSupportTickets, CustomerSupportTickets } from "../drizzle/schema";

export const customerSupportService = async (limit?:number): Promise<TSCustomerSupportTickets[] | null> => {
    if(limit){
        return await db.query.CustomerSupportTickets.findMany({
            limit: limit
        });
    }
    return await db.query.CustomerSupportTickets.findMany();
}

export const getCustomerSupportService = async (id: number): Promise<TSCustomerSupportTickets | undefined> => {
    return await db.query.CustomerSupportTickets.findFirst({
        where: eq(CustomerSupportTickets.ticket_id, id),
    });
}

export const updateCustomerSupportService = async (id: number, customerSupport: TICustomerSupportTickets) => {
    await db.update(CustomerSupportTickets).set(customerSupport).where(eq(CustomerSupportTickets.ticket_id, id)).execute();
    return 'Customer Support updated successfully';
}

export const createCustomerSupportService = async (customerSupport: TICustomerSupportTickets) => {
    await db.insert(CustomerSupportTickets).values(customerSupport).execute();
    return 'Customer Support created successfully';
}

export const deleteCustomerSupportService = async (id: number) => {
    await db.delete(CustomerSupportTickets).where(eq(CustomerSupportTickets.ticket_id, id)).execute();
    return 'Customer Support deleted successfully';
}