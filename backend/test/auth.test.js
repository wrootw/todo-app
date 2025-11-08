import app from "../src/app";
import { setupDB, teardownDB } from "./setup.js";
import  request  from "supertest";


beforeAll(async () => {await setupDB();});
afterAll(async () => {await teardownDB();});

test("register & login", async () => {
    const email= "g@g.com";
    const password= "123456";

    const reg=await request(app).post("/api/auth/register").send({email, password});
    expect(reg.status).toBe(201);

    const log=await request(app).post("/api/auth/login").send({email, password});
    expect(log.status).toBe(200);
    expect(log.body.token).toBeTruthy();
    expect(log.body.user.email).toBe(email);
})