import express from 'express';
import authentication from 'express-authentication';
import {ControllerAuthentication} from '../controller/authentication/ControllerAuthentication';
import {ControllerProduct} from '../controller/admin/ControllerProduct';
import {ControllerUser} from '../controller/admin/ControllerUser';

export class RouterWebshop {
    constructor() {
        this.router = express.Router();
        this.controllerAuthentication = new ControllerAuthentication();
        this.controllerProduct = new ControllerProduct();
        this.controllerUser = new ControllerUser();

        this.router.get('/', async (request, response) => {                                 // GET dummy
            response.json('bin auch eine message')
        });

        this.router.post('/auth/signin', async (request, response) => {
            await this.controllerAuthentication.signIn(request, response);
        });

        this.router.post('/auth/signout', authentication.required(), async (request, response) => {
            await this.controllerAuthentication.signOut(request, response);
        });

        this.router.get('/admin/products', authentication.required(), async (request, response) => {
            await this.controllerProduct.getProducts(request, response);
        });

        this.router.get('/admin/users', authentication.required(), async (request, response) => {
            await this.controllerUser.getUsers(request, response);
        });

    }

    getRouter() {
        return this.router;
    }

    getControllerAuthentication() {
        return this.controllerAuthentication;
    }

}
