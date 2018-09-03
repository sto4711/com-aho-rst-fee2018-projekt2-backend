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
            let userId = null;
            let order = null;

            if (shoppingBasket != null) {
                const session = await this.storeSession.getSessionByToken(request.headers.authorization);
                userId = session.userID;
            }else   {
                Logger.traceError(this.LOGGER_NAME, 'create', 'shoppingBasket not found');
                response.status(404).send('shoppingBasket not found');
            }

            if (userId != null) {
                order = await this.storeOrder.get(shoppingBasket._id);
            }else   {
                Logger.traceError(this.LOGGER_NAME, 'create', 'user / session not found');
                response.status(404).send('user / session not found');
            }

            if (order == null) {
                shoppingBasket.userID = userId;
                shoppingBasket.created = new Date();
                shoppingBasket.state = 'created';
                await this.storeOrder.create(shoppingBasket);
                Logger.traceMessage(this.LOGGER_NAME, 'create', 'ok');
                response.json(shoppingBasket);
            }else   {
                Logger.traceMessage(this.LOGGER_NAME, 'create', 'order already created');
                response.json(order);
            }
        } catch (e) {
            Logger.traceError('ControllerOrder', 'create', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async getOrderDetails(request, response)  {
        try {
            response.json(await this.storeOrder.getOrderDetails(request.query.id));
            Logger.traceMessage(this.LOGGER_NAME, 'getOrderDetails', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'getOrderDetails', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }



}