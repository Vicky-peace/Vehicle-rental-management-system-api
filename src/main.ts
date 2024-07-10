import {Hono} from 'hono';
import "dotenv/config";
import {serve} from "@hono/node-server";
import {cors} from 'hono/cors';


//routes
import { authRouter } from './auth/auth.router';
import { userRouter } from './users/users.router';
import { vehicleSpecificationRouter } from './vehicle_specifications/vehicleSpecifiactions.router';
import { locationRouter } from './locations/locations.router';
import { vehicleRouter } from './vehicles/vehicle.router';
import { bookingRouter } from './bookings/bookings.router';
import { customerRouter } from './customer-support/customer.router';
import { fleetRouter } from './fleet-management/fleet.router';
import { paymentsRouter } from './payments/payments.router';




const app = new Hono();


//CORS for all routes
app.use('*', cors())

app.get('/', async(c) =>{
    return c.json({message: 'Welcome to my API'});
})

app.route('/', authRouter)
app.route('/', userRouter)
app.route('/', vehicleSpecificationRouter)
app.route('/', locationRouter)
app.route('/', vehicleRouter)
app.route('/', bookingRouter)
app.route('/', customerRouter)
app.route('/', fleetRouter)
app.route('/', paymentsRouter)


serve({
    fetch: app.fetch,
    port: Number(process.env.PORT)
})

console.log(`Server is running on http://localhost:${process.env.PORT}`)