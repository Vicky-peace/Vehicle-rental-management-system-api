import { Context } from "hono";
import { userService,getUserService , updateuserService,deleteUserService,updateUserDetails} from "./users.service";

export const listUsers = async (c:Context) =>{
    try {
        const limit = Number(c.req.query('limit'));

        const data = await userService(limit);  
        if(data == null || data.length == 0){
            return c.json({message: 'User not found'}, 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const getUser = async(c:Context) =>{
    try {
        const id = parseInt(c.req.param('id'));
        if(isNaN(id)) return c.text("Invalid ID", 400);

        const user = await getUserService(id);
        if(user == undefined){
            return c.json({message: 'User not found'}, 404);
        }
        return c.json(user, 200);
    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const updateUser = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    const user = await c.req.json();
    try {
        //search the user
        const searchUser = await getUserService(id);
        if(searchUser == undefined){
            return c.json({message: 'User not found'}, 404);
        }
        //update user
        const res = await updateuserService(id, user);
        
        if(!res) return c.json({message: 'User not updated'}, 404);  
        
        return c.json({message: res}, 200);

    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const deleteUser = async (c:Context) =>{
    const id = parseInt(c.req.param('id'));
    if(isNaN(id)) return c.text("Invalid ID", 400);
    try {
        //search the user
        const searchUser = await getUserService(id);
        if(searchUser == undefined){
            return c.json({message: 'User not found'}, 404);
        }
        //delete user
        const res = await deleteUserService(id);
        
        if(!res) return c.json({message: 'User not deleted'}, 404);  
        
        return c.json({message: res}, 200);

    } catch (error: any) {
        return c.json({error:error.message}, 400);
    }
}

export const updateUserDetailsController = async (c:Context) =>{
    try {
        const userId = Number(c.req.param('id'));
        const userData = await c.req.json();

        if(!userId) return c.json({message: 'User ID is required'}, 400);

        const res = await updateUserDetails({...userData, user_id: userId});
        return c.json({message: res}, 200);
    } catch (error: any) {
        return c.json({message: 'Failed to update user',error:error.message}, 400);
        
    }
}