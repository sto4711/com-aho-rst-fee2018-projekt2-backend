import {Logger} from "../commons/Logger";
import {DatabaseMananger_NEDB} from "../commons/DatabaseMananger_NEDB";

export class StoreProduct {
    constructor() {
        this.dbMananger_Product = new DatabaseMananger_NEDB("data/product.db");
    }

    async getProducts() {
        Logger.traceError('StoreProduct','getProducts','ok');
//        return await this.dbMananger.find({"state": "ACTIVE"});
        return await this.dbMananger_Product.find();
    }

}