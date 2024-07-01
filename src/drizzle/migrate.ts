import "dotenv/config";
import {migrate} from "drizzle-orm/node-postgres/migrator";

import db, {client} from "./db";

async function  migration(){
    await migrate(db, {migrationsFolder: __dirname + '/migrations'})
    await client.end();
}

migration().catch((err) =>{
    console.log(err);
    process.exit(0)
})