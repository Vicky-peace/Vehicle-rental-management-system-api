import {Hono} from 'hono';
import "dotenv/config";
import {serve} from "@hono/node-server";


//routes
import { authRouter } from './auth/auth.router';
import { userRouter } from './users/users.router';
import { vehicleSpecificationRouter } from './vehicle_specifications/vehicleSpecifiactions.router';
import { locationRouter } from './locations/locations.router';




const app = new Hono();


app.get('/', async(c) =>{
    return c.json({message: 'Welcome to my API'});
})

app.route('/', authRouter)
app.route('/', userRouter)
app.route('/', vehicleSpecificationRouter)
app.route('/', locationRouter)


serve({
    fetch: app.fetch,
    port: Number(process.env.PORT)
})

console.log(`Server is running on http://localhost:${process.env.PORT}`)