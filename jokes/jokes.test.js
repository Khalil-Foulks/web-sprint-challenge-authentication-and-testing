const request = require("supertest");

const server = require("../api/server");

const db = require("../database/dbConfig");
const { expectCt } = require("helmet");

describe("jokes router", () => {
    beforeEach(async () =>{
        await db("users").truncate();
    })

    describe("GET /jokes", () => {
        it("should be defined", async () => {
            await request(server).get("/api/jokes")
            .then(res => {
                expect(res.body).toBeDefined();
            })
        })
        it("should send 401", async () => {
            await request(server).get("/api/jokes")
            .then(res => {
                expect(res.status).toBe(401);
            })
        })
    })
})