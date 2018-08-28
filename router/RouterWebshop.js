import express from 'express';
import authentication from 'express-authentication';
import {ControllerUser} from '../controller/ControllerUser';
import {ControllerArticle} from '../controller/ControllerArticle';
import {ControllerShoppingBasket} from "../controller/ControllerShoppingBasket";

export class RouterWebshop {
    constructor() {
        this.router = express.Router();
        this.controllerUser = new ControllerUser();
        this.controllerArticle = new ControllerArticle();
        this.controllerShoppingBasket = new ControllerShoppingBasket();

        this.router.get('/user/isLoggedIn', async (request, response) => {
            await this.controllerUser.isLoggedIn(request, response);
        });

        this.router.post('/user/signIn', async (request, response) => {
            await this.controllerUser.signIn(request, response);
        });

        this.router.post('/user/signOut', authentication.required(), async (request, response) => {
            await this.controllerUser.signOut(request, response);
        });

        this.router.get('/users', authentication.required(), async (request, response) => {
            await this.controllerUser.getUsers(request, response);
        });

        this.router.get('/user-details', authentication.required(), async (request, response) => {
            await response.json({status : 'not yet implemented'});
        });

        this.router.get('/articles',  async (request, response) => {
            await this.controllerArticle.getArticles (request, response);
        });

        this.router.get('/article-details',  async (request, response) => {
            await this.controllerArticle.getArticleDetails(request, response);
        });

        this.router.post('/shopping-basket/create', async (request, response) => {
            await this.controllerShoppingBasket.createShoppingBasket(request, response);
        });

        this.router.post('/shopping-basket/addItem', async (request, response) => {
            await this.controllerShoppingBasket.addItem_ShoppingBasket(request, response);
        });

        this.router.post('/shopping-basket/removeItem', async (request, response) => {
            await this.controllerShoppingBasket.removeItem_ShoppingBasket(request, response);
        });
        this.router.get('/shopping-basket/', async (request, response) => {
            await this.controllerShoppingBasket.get_ShoppingBasket(request, response);
        });

    }

    getRouter() {
        return this.router;
    }

    getControllerUser() {
        return this.controllerUser;
    }

}
