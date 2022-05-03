import supertest from "supertest"
import app from "../src/app.js";
import { prisma } from "../src/database.js";
import * as userFactory from "./factories/userFactory.js"
import * as testFactory from "./factories/testFactory.js"

describe("POST /sign-up", () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return 201 and persist data given a valid sign-up form", async () =>{
        await prisma.$executeRaw`TRUNCATE TABLE "users"`;
        
        const user = await userFactory.userForm();
        const response = await supertest(app).post("/sign-up").send({email: user.email, password: user.password});
        const resgisteredUser = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });

        expect(resgisteredUser).not.toBeNull();
        expect(response.status).toBe(201);
    }); 

    it("should return 409 given a same email registered in database", async () =>{
        
        const user = await userFactory.userForm();
        const response = await supertest(app).post("/sign-up").send({email: user.email, password: user.password})
        const emailExists = await prisma.user.findMany({
            where: {
                email: user.email
            }
        })
        expect(emailExists.length).toEqual(1);
        expect(response.status).toBe(409);
    }); 
    
    it("should return 422 given an empty sign-up form", async () =>{
        const response = await supertest(app).post("/sign-up").send({});
    
        expect(response.status).toBe(422);
    }); 

});

describe("POST /sign-in", () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });


    it("should return 200 given a valid sign-in form", async () => {
        const user = await userFactory.userForm();
        const response = await supertest(app).post("/sign-in").send({email: user.email, password: user.password});
        expect(response.status).toBe(200);
        expect(response.body.token.length).toBeGreaterThan(0);
    });

    it("should return 401 given an ivalid data in sign-in form", async () => {
        const user = await userFactory.userForm();
        user.password = "12"

        const response = await supertest(app).post("/sign-in").send({email: user.email, password: user.password});
        expect(response.status).toBe(401);
    });

    it("should return 401 given a not registered email", async () => {
        const user = await userFactory.userForm();
        user.email = "teste2@email.com"
        
        const response = await supertest(app).post("/sign-in").send({email: user.email, password: user.password});
        const emailDoesNotExist = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        })
        expect(emailDoesNotExist).toBeNull();
        expect(response.status).toBe(401);
        
    });
});

describe("Post /add-prova", () => {
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return 201 given a valid form", async () => {
        const user = await userFactory.userForm();
        const signInResponse = await supertest(app).post("/sign-in").send({email: user.email, password: user.password});
        const token = signInResponse.body.token; 
        const test = await testFactory.testForm();
        const addTestResponse = await supertest(app).post("/add-test").send(test).set("authorization", `Bearer ${token}`);
        expect(addTestResponse.status).toBe(201);
    });

    it("should return 422 given a missing field", async () => {
        const user = await userFactory.userForm();
        const signInResponse = await supertest(app).post("/sign-in").send({email: user.email, password: user.password});
        const token = signInResponse.body.token; 
        const test = await testFactory.testForm();
        delete test.category;
        const addTestResponse = await supertest(app).post("/add-test").send(test).set("authorization", `Bearer ${token}`);
        expect(addTestResponse.status).toBe(422);
    });

    it("should return 401 not given a authorization header", async () => {
        const user = await userFactory.userForm();
        const signInResponse = await supertest(app).post("/sign-in").send({email: user.email, password: user.password});
        const token = signInResponse.body.token; 
        const test = await testFactory.testForm();
        const addTestResponse = await supertest(app).post("/add-test").send(test);
        expect(addTestResponse.status).toBe(401);
    });
});




