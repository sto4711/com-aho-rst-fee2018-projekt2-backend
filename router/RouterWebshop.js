import express from 'express';
import authentication from 'express-authentication';
import {ControllerAuthenticationUser} from '../controller/admin/ControllerAuthenticationUser';
import {ControllerArticle} from '../controller/admin/ControllerArticle';

export class RouterWebshop {
    constructor() {
        this.router = express.Router();
        this.controllerAuthenticationUser = new ControllerAuthenticationUser();
        this.controllerArticle = new ControllerArticle();

        this.router.get('/', async (request, response) => {                                 // GET dummy
            response.json('bin auch eine message')
        });

        this.router.post('/auth/signin', async (request, response) => {
            await this.controllerAuthenticationUser.signIn(request, response);
        });

        this.router.post('/auth/signout', authentication.required(), async (request, response) => {
            await this.controllerAuthenticationUser.signOut(request, response);
        });

        this.router.get('/admin/users', authentication.required(), async (request, response) => {
            await this.controllerAuthenticationUser.getUsers(request, response);
        });

        this.router.get('/admin/articles',  async (request, response) => {
            await this.controllerArticle.getArticles(request, response);
        });
    }

    getRouter() {
        return this.router;
    }

    getControllerAuthenticationUser() {
        return this.controllerAuthenticationUser;
    }

}
