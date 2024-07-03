import { Context } from "hono";
import {customerSupportService,getCustomerSupportService,updateCustomerSupportService,createCustomerSupportService,deleteCustomerSupportService } from "./customer.service";
import { tracingChannel } from "diagnostics_channel";

export const getAllCustomerSupport = async (c:Context) =>{
    try {
        const limit = Number(c.req.query('limit'));
        const data = await customerSupportService(limit);
        if(data == null || data.length == 0){
            return c.json({message: 'Customer Support not found'}, 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({erorr: error.message}, 400);
    }
}

export const getCustomerSupport = async(c:Context) =>{
    try {
        const id = parseInt(c.req.param('id'));
        if(isNaN(id)) return c.text("Invalid ID", 400);

        const customerSupport = await getCustomerSupportService(id);
        if(!customerSupport){
            return c.json({message: 'Customer Support not found'}, 404);
        }
        return c.json(customerSupport, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
    }
}

export const updateCustomerSupport = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    const customerSupport = await c.req.json();
    try {
        //search customer support
        const searchCustomerSupport = await getCustomerSupportService(id);
        if(!searchCustomerSupport){
            return c.json({message: 'Customer Support not found'}, 404);
        }
        //update customer support
        const res = await updateCustomerSupportService(id, customerSupport);
        if(!res) return c.json({message: 'Customer Support not updated'}, 404);
        return c.json({message: res}, 200);
        
    } catch (error: any) {
        return c.json({error: error.message}, 400)
        
    }
}

export const createCustomerSupport = async (c:Context) =>{
    try {
        const customerSupport = await c.req.json();
        const data = await createCustomerSupportService(customerSupport);
        if(!data) return c.json({message: 'Customer Support not created'}, 404);
        return c.json({message: data}, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
    }
}

export const deleteCustomerSupport = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try {
        //search the customer support
        const searchCustomerSupport = await getCustomerSupportService(id);
        if(!searchCustomerSupport){
            return c.json({message: 'Customer Support not found'}, 404);
        }

        //deleting the customer support
        const data = await deleteCustomerSupportService(id);
        if(!data) return c.json({message: 'Customer Support not deleted'}, 404);
        return c.json({message: data}, 200);
    } catch (error: any) {
        return c.json({error: error.message}, 400);
    }
}