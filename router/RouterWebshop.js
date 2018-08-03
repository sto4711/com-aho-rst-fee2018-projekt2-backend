import express from 'express';
import {ControllerAuthentification} from "../controller/ControllerAuthentification";

export class RouterWebshop {
    constructor() {
        this.router = express.Router();
        this.controllerAuthentification = new ControllerAuthentification();

        this.router.get("/", async (request, response) => {                                 // GET ITEM(s)
            response.json("bin auch eine message")
        });

        this.router.post("/auth/signin", async (request, response) => {                                // login, get token; gets back 401 if not ok
            await this.controllerAuthentification.signin(request, response);
        });
    }

    getRouter() {
        return this.router;
    }
}
