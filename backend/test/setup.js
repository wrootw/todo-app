import  { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"


let mongo;

export async function setupDB() {
    mongo= await MongoMemoryServer.create();
    const url= mongo.getUri();
    await mongoose.connect(url);    
}

export async function teardownDB() {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongo.stop();
}