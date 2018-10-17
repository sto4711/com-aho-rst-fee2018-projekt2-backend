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

    async getLatestFromUser(userId) {
        const orderArr = await this.dbMananger_Order.find({"userID": userId}, {"orderDate": this.dbMananger_Order.DESCENDING}, 1);
        return (orderArr.length === 0 ? null : orderArr[0]);
    }

    async getOrderDetails(id) {
        const orderArr = await this.dbMananger_Order.find({"_id": id});
        return (orderArr.length === 0 ? null : orderArr[0]);
    }

    async getOrderAll(filter, sort, limit) {
        return await this.dbMananger_Order.find(filter, {"orderDate": this.dbMananger_Order.DESCENDING}, limit);
    }

    async getOrdersByUser(userId) {
        return await this.dbMananger_Order.find({"userID": userId}, {"orderDate": this.dbMananger_Order.DESCENDING});
    }

    async update(order) {
        await this.dbMananger_Order.update(order._id, order);
        Logger.traceMessage(this.LOGGER_NAME, 'update', 'ok');
    }

    async delete(order) {
        await this.dbMananger_Order.remove(order._id);
        Logger.traceMessage(this.LOGGER_NAME, 'remove', 'ok');
    }


}