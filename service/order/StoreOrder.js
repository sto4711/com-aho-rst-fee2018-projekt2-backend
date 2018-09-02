import UIDGenerator from 'uid-generator';
import {Logger} from "../../commons/Logger";
import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";
import {ShoppingBasket} from "../shopping-basket/ShoppingBasket";


export class StoreOrder {
    constructor() {
        this.dbMananger_Order = new DatabaseMananger_NEDB("data/order.db");
        this.LOGGER_NAME = 'StoreOrder';
    }

    async create(shoppingBasket) {
        const order = await this.dbMananger_Order.insert(shoppingBasket);
        Logger.traceMessage(this.LOGGER_NAME, 'create', 'order created');
    }

    async get(id) {
        const orderArr = await this.dbMananger_Order.find({"_id": id});
        return (orderArr.length === 0 ? null : orderArr[0]);
    }

    async getArticleDetails(id) {
        return await this.dbMananger_Product.find({"_id": id});
    }




}