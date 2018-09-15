import {StoreSession} from '../service/user/StoreSession';
import {StoreUser} from '../service/user/StoreUser';
import {Logger} from '../commons/Logger';
import {StoreOrder} from "../service/order/StoreOrder";

export class ControllerOrder {
    constructor(storeShoppingBasket, storeSession) {
        this.storeShoppingBasket = storeShoppingBasket;
        this.storeSession = storeSession;
        this.storeOrder = new StoreOrder();
        this.LOGGER_NAME = 'ControllerOrder';
    }

    async create(request, response) {
        try {
            const shoppingBasket = await this.storeShoppingBasket.get(request.body.shoppingBasketId);
            if (shoppingBasket != null) {
                response.json(await this.storeOrder.create(shoppingBasket));
                Logger.traceMessage(this.LOGGER_NAME, 'create', 'ok');
            } else {
                Logger.traceError(this.LOGGER_NAME, 'create', 'shoppingBasket not found');
                response.status(404).send('shoppingBasket not found');
            }
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'create', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async getOrderDetails(request, response) {
        try {
            response.json(await this.storeOrder.getOrderDetails(request.query.id));
            Logger.traceMessage(this.LOGGER_NAME, 'getOrderDetails', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'getOrderDetails', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async change(request, response) {
        try {
            let order = await this.storeOrder.getOrderDetails(request.body.orderId);
            let ok = (order != null ? true : false);
            if (ok) {
                if (request.url.endsWith('change-delivery-address')) {
                    order.deliveryAddress = request.body.deliveryAddress;
                    await this.storeOrder.update(order);
                    response.json(order);
                    Logger.traceMessage(this.LOGGER_NAME, 'change deliveryAddress', 'ok');
                } else if (request.url.endsWith('change-contact-data')) {
                    order.contactData = request.body.contactData;
                    await this.storeOrder.update(order);
                    response.json(order);
                    Logger.traceMessage(this.LOGGER_NAME, 'change contactData', 'ok');
                }
                else if (request.url.endsWith('change-delivery-type')) {
                    order.deliveryType = request.body.deliveryType;
                    await this.storeOrder.update(order);
                    response.json(order);
                    Logger.traceMessage(this.LOGGER_NAME, 'change deliveryType', 'ok');
                }
                else if (request.url.endsWith('change-payment-type')) {
                    order.paymentType = request.body.paymentType;
                    await this.storeOrder.update(order);
                    response.json(order);
                    Logger.traceMessage(this.LOGGER_NAME, 'change paymentType', 'ok');
                }
                else {
                    ok = false;
                }
            }

            if (!ok) {
                Logger.traceError(this.LOGGER_NAME, 'change', 'order not found / URL not found');
                response.status(404).send('order not found');
            }
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'change', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async commit(request, response) {
        try {
            let order = await this.storeOrder.getOrderDetails(request.body.orderId);
            if (order != null) {
                order.state = 'commit';
                await this.storeOrder.update(order);
                response.json(order);
                Logger.traceMessage(this.LOGGER_NAME, 'commit', 'ok');
            } else {
                Logger.traceError(this.LOGGER_NAME, 'commit', 'order not found / URL not found');
                response.status(404).send('order not found');
            }
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'commit', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }


}