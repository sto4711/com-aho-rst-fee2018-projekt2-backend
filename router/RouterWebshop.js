import express from 'express';
import authentication from 'express-authentication';
import {ControllerUser} from '../controller/ControllerUser';
import {ControllerArticle} from '../controller/ControllerArticle';
import {ControllerShoppingBasket} from "../controller/ControllerShoppingBasket";
import {ControllerOrder} from "../controller/ControllerOrder";

export class RouterWebshop {
    constructor() {
        this.router = express.Router();
        this.controllerUser = new ControllerUser();
        this.controllerArticle = new ControllerArticle();
        this.controllerShoppingBasket = new ControllerShoppingBasket(this.controllerArticle.getStoreArticle());
        this.controllerOrder = new ControllerOrder(this.controllerShoppingBasket.getStoreShoppingBasket(), this.controllerUser.getStoreSession());

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
            await response.json({status: 'not yet implemented'});
        });

        this.router.get('/articles', async (request, response) => {
            await this.controllerArticle.getArticles(request, response);
        });

        this.router.get('/articles/newest', async (request, response) => {
            await this.controllerArticle.getArticlesNewest(request, response);
        });

        this.router.get('/article-details', async (request, response) => {
            await this.controllerArticle.getArticleDetails(request, response);
        });

        this.router.post('/shopping-basket/create', async (request, response) => {
            await this.controllerShoppingBasket.createShoppingBasket(request, response);
        });

        this.router.get('/shopping-basket/', async (request, response) => {
            await this.controllerShoppingBasket.getShoppingBasket(request, response);
        });

        this.router.post('/shopping-basket/addItem', async (request, response) => {
            await this.controllerShoppingBasket.addItem_ShoppingBasket(request, response);
        });

        this.router.post('/shopping-basket/changeItemAmount', async (request, response) => {
            await this.controllerShoppingBasket.changeItemAmount_ShoppingBasket(request, response);
        });

        this.router.post('/shopping-basket/removeItem', async (request, response) => {
            await this.controllerShoppingBasket.removeItem_ShoppingBasket(request, response);
        });

        this.router.post('/order/create', authentication.required(), async (request, response) => {
            await this.controllerOrder.create(request, response);
        });

        this.router.get('/order-details', async (request, response) => {
            await this.controllerOrder.getOrderDetails(request, response);
        });


    }

    getRouter() {
        return this.router;
    }

    getControllerUser() {
        return this.controllerUser;
    }

}
