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
            await this.controllerAuthentication.signIn(request, response);
        });

        this.router.post('/auth/signout', authentication.required(), async (request, response) => {
            await this.controllerAuthentication.signOut(request, response);
        });

        this.router.get('/products', authentication.required(), async (request, response) => {
            response.json('product1,product2,... ' + Date.now() )
        });
    }

    getRouter() {
        return this.router;
    }

    getControllerAuthentication() {
        return this.controllerAuthentication;
    }

}
