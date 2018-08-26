import {Logger} from "../../commons/Logger";
import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";
import {ShoppingBasket} from "./ShoppingBasket";


export class StoreShoppingBasket {
    constructor() {
        this.dbMananger_ShoppingBasket = new DatabaseMananger_NEDB("data/shoppingbasket.db");
        this.LOGGER_NAME = 'StoreShoppingBasket';
    }

    async create() {
        const shoppingBasket = await this.dbMananger_ShoppingBasket.insert(new ShoppingBasket());
        Logger.traceMessage(this.LOGGER_NAME, 'create', 'basket created');
        return shoppingBasket;
    }

    async get(shoppingBasketID) {
        const basketArr = await this.dbMananger_ShoppingBasket.find({"_id": shoppingBasketID});
        Logger.traceMessage(this.LOGGER_NAME, 'get', 'get ok');
        return (basketArr.length === 0 ? null : basketArr[0]);
    }

    async update(shoppingBasket) {
        await this.dbMananger_ShoppingBasket.update(shoppingBasket._id, shoppingBasket);
        Logger.traceMessage(this.LOGGER_NAME, 'update', 'ok');
    }






}