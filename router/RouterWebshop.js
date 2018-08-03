import express from 'express';
import authentication from 'express-authentication';
import {ControllerAuthentification} from "../controller/ControllerAuthentification";

export class RouterWebshop {
    constructor() {
        this.router = express.Router();
        this.controllerAuthentification = new ControllerAuthentification();

        this.router.get("/", async (request, response) => {                                 // GET dummy
            response.json("bin auch eine message")
        });

        this.router.post("/auth/signin", async (request, response) => {                                // login, get token; gets back 401 if not ok
            await this.controllerAuthentification.signin(request, response);
        });

        this.router.get("/products", authentication.required(), async (request, response) => {                                 // GET products
            response.json("bin auch ein product")
        });
    }

    getRouter() {
        return this.router;
    }
}
