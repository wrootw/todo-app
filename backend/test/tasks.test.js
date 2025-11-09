import app from "../src/app";
import  request from "supertest";
import { setupDB, teardownDB } from "./setup.js";


let token="";

beforeAll(async () => {
    await setupDB();
    await request(app).post("/api/auth/register").send({"email":"a@a.com", "password":"123456"});
    const {body}=await request(app).post("/api/auth/login").send({"email":"a@a.com", "password":"123456"});
    token= body.token;
});

afterAll(async () => {
    await teardownDB();
});

test("create, list, update, delete", async ()=> {

    const cre= await request(app).post("/api/tasks").set("Authorization", `Bearer ${token}`)
    .send({title:"World", description:"Nice"});
    expect(cre.status).toBe(201);
    const id= cre.body._id;

    const list= await request(app).get("/api/tasks?page=1&limit=10").set("Authorization", `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.items.length).toBe(1);

    const upd= await request(app).patch(`/api/tasks/${id}`).set("Authorization", `Bearer ${token}`)
    .send({"completed":true});
    expect(upd.status).toBe(200);   
    expect(upd.body.completed).toBe(true);

    const del= await request(app).delete(`/api/tasks/${id}`).set("Authorization", `Bearer ${token}`)
    expect(del.status).toBe(204);
})

