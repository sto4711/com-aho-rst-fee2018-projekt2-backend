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
        this.controllerOrder = new ControllerOrder(this.controllerShoppingBasket.getStoreShoppingBasket(), this.controllerUser.getStoreSession(),this.controllerUser.getStoreUser());

        this.router.post('/user/sign-in', async (request, response) => {
            await this.controllerUser.signIn(request, response);
        });

        this.router.post('/user/sign-out', async (request, response) => {
            await this.controllerUser.signOut(request, response);
        });

        this.router.post('/user/create', async (request, response) => {
            await this.controllerUser.create(request, response);
        });
        this.router.post('/user/updateUser', async (request, response) => {
            await this.controllerUser.updateUser(request, response);
        });
        this.router.post('/user/deleteUser', async (request, response) => {
            await this.controllerUser.deleteUser(request, response);
        });

        this.router.get('/user', async (request, response) => {
            await this.controllerUser.getUser(request, response);
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

        this.router.get('/articles', async (request, response) => {
            await this.controllerArticle.getArticles(request, response);
        });

        this.router.get('/articles/latest', async (request, response) => {
            await this.controllerArticle.getArticlesLatest(request, response);
        });

        this.router.get('/article-details', async (request, response) => {
            await this.controllerArticle.getArticleDetails(request, response);
        });

        this.router.patch('/article-details/change-rating', async (request, response) => {
            await this.controllerArticle.changeArticleRating(request, response);
        });

        this.router.post('/shopping-basket/create', async (request, response) => {
            await this.controllerShoppingBasket.create(request, response);
        });

        this.router.get('/shopping-basket/', async (request, response) => {
            await this.controllerShoppingBasket.get(request, response);
        });

        this.router.post('/shopping-basket/add-item', async (request, response) => {
            await this.controllerShoppingBasket.addItem(request, response);
        });

        this.router.patch('/shopping-basket/change-item-amount', async (request, response) => {
            await this.controllerShoppingBasket.changeItemAmount(request, response);
        });

        this.router.post('/shopping-basket/remove-item', async (request, response) => {
            await this.controllerShoppingBasket.removeItem(request, response);
        });

        this.router.post('/order/create', authentication.required(), async (request, response) => {
            await this.controllerOrder.create(request, response);
        });

        this.router.get('/order-details', async (request, response) => {
            await this.controllerOrder.getOrderDetails(request, response);
        });

        this.router.get('/order-all', async (request, response) => {
            await this.controllerOrder.getOrderAll(request, response);
    });

        this.router.patch('/order/change-delivery-address', authentication.required(), async (request, response) => {
            await this.controllerOrder.change(request, response);
        });

        this.router.patch('/order/change-contact-data', authentication.required(), async (request, response) => {
            await this.controllerOrder.change(request, response);
        });

        this.router.patch('/order/change-delivery-type', authentication.required(), async (request, response) => {
            await this.controllerOrder.change(request, response);
        });

        this.router.patch('/order/change-payment-type', authentication.required(), async (request, response) => {
            await this.controllerOrder.change(request, response);
        });

        this.router.patch('/order/state', authentication.required(), authentication.required(), async (request, response) => {
            await this.controllerOrder.changeState(request, response);
        });

        this.router.patch('/order/update', async (request, response) => {
            await this.controllerOrder.updateOrder(request, response);
        });

        this.router.patch('/order/delete-order', async (request, response) => {
            await this.controllerOrder.deleteOrder(request, response);
        });
    }

    getRouter() {
        return this.router;
    }

    getControllerUser() {
        return this.controllerUser;
    }

}
