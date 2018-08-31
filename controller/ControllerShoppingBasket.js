import {Logger} from "../commons/Logger";
import {StoreShoppingBasket} from "../service/shopping-basket/StoreShoppingBasket";
import {ShoppingBasketItem} from "../service/shopping-basket/ShoppingBasketItem";

export class ControllerShoppingBasket {
    constructor(storeArticle) {
        this.storeShoppingBasket = new StoreShoppingBasket();
        this.storeArticle = storeArticle;
        this.LOGGER_NAME = 'ControllerShoppingBasket';
    }

    async createShoppingBasket(request, response) {
        try {
            response.json(await this.storeShoppingBasket.create());
            Logger.traceMessage(this.LOGGER_NAME, 'createShoppingBasket', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'createShoppingBasket', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async addItem_ShoppingBasket(request, response) {
        try {
            let shoppingBasket = await this.storeShoppingBasket.get(request.body.shoppingBasketID);
            let articleAlreadyExists = false;
            if (shoppingBasket != null) {
                //check if article already exists
                for (let i = 0; i < shoppingBasket.items.length; i++) {
                    if (shoppingBasket.items[i].articleID === request.body.articleID) {
                        articleAlreadyExists = true;
                        break;
                    }
                }

                if(articleAlreadyExists)    {
                    Logger.traceMessage(this.LOGGER_NAME, 'addItem_ShoppingBasket', 'article already exists, will change amount');
                    await this.changeItemAmount_ShoppingBasket(request, response);
                }else   {
                    const article = (await this.storeArticle.getArticleDetails(request.body.articleID))[0];
                    const articlePriceSum = article.price * parseInt(request.body.articleAmount);
                    shoppingBasket.totalSum+= articlePriceSum;
                    const shoppingBasketItem = new ShoppingBasketItem(request.body.articleID, article.name, article.price, articlePriceSum, article.availability, request.body.articleAmount, article.itemNumber);
                    shoppingBasket.items.push(shoppingBasketItem);
                    await this.storeShoppingBasket.update(shoppingBasket);
                    Logger.traceMessage(this.LOGGER_NAME, 'addItem_ShoppingBasket', 'shoppingBasketID "' + request.body.shoppingBasketID + '" ok');
                }
            }
            else {
                Logger.traceError(this.LOGGER_NAME, 'addItem_ShoppingBasket', 'shoppingBasketID"' + request.body.shoppingBasketID + '" failed. no basket found ->');
                response.status(404).send('ShoppingBasket not found');
            }
            response.json(shoppingBasket);
            Logger.traceMessage(this.LOGGER_NAME, 'addItem_ShoppingBasket', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'addItem_ShoppingBasket', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async changeItemAmount_ShoppingBasket(request, response) {
        try {
            let shoppingBasket = await this.storeShoppingBasket.get(request.body.shoppingBasketID);
            shoppingBasket.totalSum = 0;
            for (let i = 0; i < shoppingBasket.items.length; i++) {
                if (shoppingBasket.items[i].articleID === request.body.articleID) {
                    shoppingBasket.items[i].articleAmount = request.body.articleAmount;
                    shoppingBasket.items[i].articlePriceSum = shoppingBasket.items[i].articleAmount * shoppingBasket.items[i].articlePrice;
                    shoppingBasket.totalSum += shoppingBasket.items[i].articlePriceSum;
                }else   {
                    shoppingBasket.totalSum += shoppingBasket.items[i].articlePriceSum;
                }
                await this.storeShoppingBasket.update(shoppingBasket);
            }
            response.json(shoppingBasket);
            Logger.traceMessage(this.LOGGER_NAME, 'changeItemAmount_ShoppingBasket', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'changeItemAmount_ShoppingBasket', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async removeItem_ShoppingBasket(request, response) {
        try {
            let shoppingBasket = await this.storeShoppingBasket.get(request.body.shoppingBasketID);
            if (shoppingBasket != null) {
                //const shoppingBasketItemsSet = new Set(shoppingBasket.items); //performance++
                //keep all the others
                shoppingBasket.items = shoppingBasket.items.filter((item) => {
                    return (item.articleID !== request.body.articleID);
                });
                // for (let i = 0; i < shoppingBasket.items.length; i++) {
                //     if (shoppingBasket.items[i].articleID === request.body.articleID) {
                //         shoppingBasket.items.splice(i, 1);
                //         break;
                //     }
                // }
                await this.storeShoppingBasket.update(shoppingBasket);
                Logger.traceMessage(this.LOGGER_NAME, 'removeItem_ShoppingBasket', 'shoppingBasketID "' + request.body.shoppingBasketID + '" ok');
            }
            else {
                Logger.traceError(this.LOGGER_NAME, 'removeItem_ShoppingBasket', 'shoppingBasketID"' + request.body.shoppingBasketID + '" failed. no basket found ->');
                response.status(404).send('ShoppingBasket not found');
            }
            response.json(shoppingBasket);
            Logger.traceMessage(this.LOGGER_NAME, 'removeItem_ShoppingBasket', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'removeItem_ShoppingBasket', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async getShoppingBasket(request, response) {
        try {
            response.json(await this.storeShoppingBasket.get(request.query.id));
            Logger.traceMessage(this.LOGGER_NAME, 'get_ShoppingBasket', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'get_ShoppingBasket', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }


}