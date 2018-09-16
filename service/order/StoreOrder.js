import UIDGenerator from 'uid-generator';
import {Logger} from "../../commons/Logger";
import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";
import {ShoppingBasket} from "../shopping-basket/ShoppingBasket";
import {Order} from "./Order";


export class StoreOrder {
    constructor() {
        this.dbMananger_Order = new DatabaseMananger_NEDB("data/order.db");
        this.LOGGER_NAME = 'StoreOrder';
    }


    async create(shoppingBasket) {
        const order = await this.dbMananger_Order.insert(new Order(shoppingBasket));
        Logger.traceMessage(this.LOGGER_NAME, 'create', 'order created');
        return order;
    }

    async get(id) {
        const orderArr = await this.dbMananger_Order.find({"_id": id});
        return (orderArr.length === 0 ? null : orderArr[0]);
    }

    async getOrderDetails(id) {
        const orderArr =  await this.dbMananger_Order.find({"_id": id});
        return (orderArr.length === 0 ? null : orderArr[0]);
    }

    async update(order) {
        await this.dbMananger_Order.update(order._id, order);
        Logger.traceMessage(this.LOGGER_NAME, 'update', 'ok');
    }








}