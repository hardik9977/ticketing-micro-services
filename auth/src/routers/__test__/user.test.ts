import request from 'supertest'
import { app } from '../../app';

describe("Singup", () => {
    it("return 201 on successful signup", async () => {
        const user = {
            email: "hardik@gmail.com",
            password: "Hari@123"
        }
        const res = await request(app).post('/api/users/signup').send(user);
        expect(res.statusCode).toBe(201);
    });

    it("return 400 on invalid email", async () => {
        const user = {
            email: "hardik.com",
            password: "hardik123"
        }
        const res = await request(app).post('/api/users/signup').send(user);
        expect(res.statusCode).toBe(400);
    });

    it("return 400 on invalid password", async () => {
        const user = {
            email: "hardik@gmail.com",
            password: "har"
        }
        const res = await request(app).post('/api/users/signup').send(user);
        expect(res.statusCode).toBe(400);
    });

    it("return 400 without user data", async () => {
        const user = {
            email: "hardik@gmail.com",
            password: "har"
        }
        const res = await request(app).post('/api/users/signup').send();
        expect(res.statusCode).toBe(400);
    });

    it("return 400 on user already exits", async () => {
        const user = {
            email: "hardik@gmail.com",
            password: "Hari@123"
        }
        await request(app).post('/api/users/signup').send(user);

        const res = await request(app).post('/api/users/signup').send(user);
        expect(res.statusCode).toBe(400);
    });

    it("set a cookies after successful signup", async () => {
        const user = {
            email: "hardik@gmail.com",
            password: "Hari@123"
        }
        const res = await request(app).post('/api/users/signup').send(user);
        expect(res.get('Set-Cookie')).toBeDefined();
    });
})

describe("Signin", () => {

    it("return 200 on successful signin", async () => {
        const user = {
            email: "hardik@gmail.com",
            password: "Hari@123"
        }
        await request(app).post('/api/users/signup').send(user);
        const res = await request(app).post('/api/users/signin').send(user);
        expect(res.statusCode).toBe(200);
    });

    it("return 400 on invalid email id", async () => {
        const user = {
            email: "hardik@gmail.com",
            password: "Hari@123"
        }
        await request(app).post('/api/users/signup').send(user);
        const res = await request(app).post('/api/users/signin').send({ ...user, email: "har@gmail.com" });
        expect(res.statusCode).toBe(400);
    });

    it("return 400 on invalid password", async () => {
        const user = {
            email: "hardik@gmail.com",
            password: "Hari@123"
        }
        await request(app).post('/api/users/signup').send(user);
        const res = await request(app).post('/api/users/signin').send({ ...user, password: "har@gmail.com" });
        expect(res.statusCode).toBe(400);
    });
});

describe("Signout", () => {
    it("Signout successful", async () => {
        const user = {
            email: "hardik@gmail.com",
            password: "Hari@123"
        }
        await request(app).post('/api/users/signup').send(user);
        const res = await request(app).post('/api/users/signout');
        expect(res.statusCode).toBe(200);
        expect(res.get('Set-Cookie')).toBeDefined();
    })
})

describe("currentUser", () => {
    it("responds with details about the current user", async () => {
        const cookies = await signin();
        const loggedUser = await request(app).get('/api/users/currentuser').set("Cookie", cookies).expect(200);
        expect(loggedUser.body.currentUser).not.toBeNull();
    })

    it("responds with null", async () => {
        const loggedUser = await request(app).get('/api/users/currentuser').expect(200);
        expect(loggedUser.body.currentUser).toBeNull();
    })
})

