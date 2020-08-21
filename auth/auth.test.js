const request = require("supertest");

const server = require("../api/server");

const db = require("../database/dbConfig");

describe("auth router", () => {
    beforeEach(async () =>{
        await db("users").truncate();
    })

    describe("POST /register", () => {
        it("should add users", async () => {
            const res = await request(server).post("/api/auth/register").send({
                username:"jest",
                password:"hashedpass"
            });
            
            const users = await db("users");

            expect(users).toHaveLength(1);

            expect(res.status).toBe(201);
        })
    })
    describe("POST /login", () => {
        it("should return json", async () => {
            await request(server)
                .post("/api/auth/register").send({
                username:"jest2",
                password:"hashedpass"
                })
                .then(res => {
                    expect(res.type).toMatch(/json/i)
                })
        })
        it("should return 200", async done => {
            await request(server).post("/api/auth/register").send({
                username:"jest200",
                password:"hashedpass"
            });
            
            await request(server)
                .post("/api/auth/login").send({
                    username:"jest200",
                    password:"hashedpass"
                })
                .then(res => {
                    expect(res.status).toBe(200);
                    done();
                });
        })
    })
})