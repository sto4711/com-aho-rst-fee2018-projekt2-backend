import express from 'express';
import authentication from 'express-authentication';
import {ControllerAuthentication} from '../controller/ControllerAuthentication';
import {ControllerProduct} from '../controller/ControllerProduct';

export class RouterWebshop {
    constructor() {
        this.router = express.Router();
        this.controllerAuthentication = new ControllerAuthentication();
        this.controllerProduct = new ControllerProduct();

        this.router.get('/', async (request, response) => {                                 // GET dummy
            response.json('bin auch eine message')
        });

        this.router.post('/auth/signin', async (request, response) => {
            await this.controllerAuthentication.signin(request, response);
        });

        this.router.get('/products', authentication.required(), async (request, response) => {
            response.json('bin auch ein product')
        });
    }

    getRouter() {
        return this.router;
    }

    getControllerAuthentication() {
        return this.controllerAuthentication;
    }

}
