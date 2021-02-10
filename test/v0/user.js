const request = require('supertest')
const expect = require('chai').expect;

const app = require('../../app');
const User = require('../../models/user');

describe("api/v0/users", () =>{
    beforeEach(async () =>{
        await User.deleteMany({});
    });

    describe("POST /signup", function(){
        it("Should create and return a users", async function() {
            let data = {
                firstName: "John",
                lastName: "Doe",
                email: "hi@johndoe.com",
                password: "$0m3Rand0mPa55",
                dateOfBirth: "1976-06-25",
                country: "Nepal"
            }

            let res = await request(app).post("/api/v0/users/signup").send(data);

            expect(res.status).to.equal(201);
            expect(res.body.user).to.have.property("firstName", data.firstName);
        })
    })

    describe("POST /login", function(){
        it("Should return a token and user information", async function() {
            
            let data = {
                firstName: "John",
                lastName: "Doe",
                email: "hi@johndoe.com",
                password: "$0m3Rand0mPa55",
                dateOfBirth: "1976-06-25",
                country: "Nepal"
            }

            await request(app).post("/api/v0/users/signup").send(data); //depends on above [signup].

            data = {
                email: "hi@johndoe.com",
                password: "$0m3Rand0mPa55", // correct pass
            }

            let res = await request(app).post("/api/v0/users/login").send(data);

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("token");
            // expect(res.body).to.have.property("firstName", data.firstName);
        })
        it("Should return error if wrong pass / email provided", async function() {
            let data = {
                firstName: "John",
                lastName: "Doe",
                email: "hi@johndoe.com",
                password: "$0m3Rand0mPa55",
                dateOfBirth: "1976-06-25",
                country: "Nepal"
            };

            await request(app).post("/api/v0/users/signup").send(data); //depends on above [Signup].

            data = {
                email: "hi@johndoe.com",
                password: "$0m3Rand0mPa556asdfasd",//wrong pass
            }

            let res = await request(app).post("/api/v0/users/login").send(data);

            expect(res.status).to.equal(401);
        })
    })

    describe("Get /me", function (){
        it("Should return a user profile", async function () {
            let data = {
                firstName: "John",
                lastName: "Doe",
                email: "hi@johndoe.com",
                password: "$0m3Rand0mPa55",
                dateOfBirth: "1976-06-25",
                country: "Nepal"
            };

            await request(app).post("/api/v0/users/signup").send(data); //depends on above [Signup].

            dataB = {
                email: "hi@johndoe.com",
                password: "$0m3Rand0mPa55",
            }

            let res = await request(app).post("/api/v0/users/login").send(dataB); //depends on above [Login].

            let token = res.body.token;

            res = await request(app).get("/api/v0/users/me").set('Authorization', 'bearer ' + token)
            
            expect(res.status).to.equal(200);
            expect(res.body.user).to.have.property("firstName", data.firstName);
        })

        it("Should require authorization", async function () {
            res = await request(app).get("/api/v0/users/me")//.set('Authorization', 'bearer ' + token)
            
            expect(res.status).to.equal(401);
        })
    })

    describe("Get /:id", () =>{
        it("should return a user if valid id is passed", async ()=>{
            const user = new User({
                firstName: "John",
                lastName: "Doe",
                email: "hi@johndoe.com",
                password: "$0m3Rand0mPa55",
                dateOfBirth: "1976-06-25",
                country: "Nepal"
            })
            let savedUser = await user.save();
            const res = await request(app).get("/api/v0/users/user/" + savedUser._id);

            expect(res.status).to.equal(200);
            expect(res.body.user).to.have.property("firstName", user.firstName);
        })

        it("should return 400 error when invalid object id is provided", async ()=>{
            const res = await request(app).get("/api/v0/users/user/1");
            expect(res.status).to.equal(400);
        })

        it("should return 404 error when valid object id is provided but does not exist.", async ()=>{
            const res = await request(app).get("/api/v0/users/user/111111111111");
            expect(res.status).to.equal(404);
        })
    })
})