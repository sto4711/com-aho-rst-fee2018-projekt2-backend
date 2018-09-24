import {Logger} from '../commons/Logger';
import {StoreOrder} from "../service/order/StoreOrder";
import {Address} from "../service/order/Address";
import {ContactData} from "../service/order/ContactData";
import {DeliveryType} from "../service/order/DeliveryType";
import {PaymentType} from "../service/order/PaymentType";

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
            const session = await this.storeSession.getSessionByToken(request.headers.authorization);

            if (shoppingBasket != null && session != null) {
                let order = await this.storeOrder.create(shoppingBasket);
                const orderLatest = await this.storeOrder.getLatestFromUser(session.userID);
                if (orderLatest != null) {
                    order.deliveryAddress = orderLatest.deliveryAddress;
                    order.contactData = orderLatest.contactData;
                    order.deliveryType = orderLatest.deliveryType;
                    order.paymentType = orderLatest.paymentType;
                    order.state = 'NEW COPY OF';
                    await this.storeOrder.update(order);
                }
                response.json(order);
                Logger.traceMessage(this.LOGGER_NAME, 'create', 'ok');
            } else {
                Logger.traceError(this.LOGGER_NAME, 'create', 'shoppingBasket / user not found');
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

    async getOrderAll(request, response) {
        try {
            response.json(await this.storeOrder.getOrderAll('', 'orderDate', ''));
            Logger.traceMessage(this.LOGGER_NAME, 'getAllOrders', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'getAllOrders', 'failed -> ' + e);
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
                    order.state = 'CHANGE DELIVERY ADDRESS';
                    await this.storeOrder.update(order);
                    response.json(order);
                    Logger.traceMessage(this.LOGGER_NAME, 'change deliveryAddress', 'ok');
                } else if (request.url.endsWith('change-contact-data')) {
                    order.contactData = request.body.contactData;
                    order.state = 'CHANGE CONTACT DATA';
                    await this.storeOrder.update(order);
                    response.json(order);
                    Logger.traceMessage(this.LOGGER_NAME, 'change contactData', 'ok');
                }
                else if (request.url.endsWith('change-delivery-type')) {
                    order.deliveryType = request.body.deliveryType;
                    order.state = 'CHANGE DELIVERY TYPE';
                    await this.storeOrder.update(order);
                    response.json(order);
                    Logger.traceMessage(this.LOGGER_NAME, 'change deliveryType', 'ok');
                }
                else if (request.url.endsWith('change-payment-type')) {
                    order.paymentType = request.body.paymentType;
                    order.state = 'CHANGE PAYMENT TYPE';
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

    async changeState(request, response) {
        try {
            let order = await this.storeOrder.getOrderDetails(request.body.orderId);
            let ok = (order != null ? true : false);

            if (ok) {
                const session = await this.storeSession.getSessionByToken(request.headers.authorization);
                order.userID = session.userID;
                ok = (order.userID != null ? true : false);
            }
            if (ok) {
                debugger;
                order.state = request.body.state;
                if (order.state === 'APPROVED') {
                    const shoppingBasket = await this.storeShoppingBasket.get(order.shoppingBasket._id);

                    if (order != null && shoppingBasket != null) {
                        order.shoppingBasket = shoppingBasket;
                        await this.storeOrder.update(order);
                        Logger.traceMessage(this.LOGGER_NAME, 'changeState', 'APPROVED, shoppingBasket synced');
                    }
                    else {
                        ok = false;
                    }
                }
            }
            if (ok) {
                await this.storeOrder.update(order);
                response.json(order);
                Logger.traceMessage(this.LOGGER_NAME, 'changeState', 'ok');
            }
            else {
                Logger.traceError(this.LOGGER_NAME, 'changeState', 'order / user / shoppingBasket not found');
                response.status(404).send('order not found');
            }
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'changeState', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }


}