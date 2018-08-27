import {Logger} from "../commons/Logger";
import {StoreShoppingBasket} from "../service/shopping-basket/StoreShoppingBasket";
import {ShoppingBasketItem} from "../service/shopping-basket/ShoppingBasketItem";

export class ControllerShoppingBasket {
    constructor() {
        this.storeShoppingBasket = new StoreShoppingBasket();
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
            if (shoppingBasket != null) {
                const shoppingBasketItem = new ShoppingBasketItem(request.body.articleID, request.body.count);
                shoppingBasket.items.push(shoppingBasketItem);
                await this.storeShoppingBasket.update(shoppingBasket);
                Logger.traceMessage(this.LOGGER_NAME, 'addItem_ShoppingBasket', 'shoppingBasketID "' + request.body.shoppingBasketID + '" ok');
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


}