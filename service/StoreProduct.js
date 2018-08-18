import {Logger} from "../commons/Logger";
import {DatabaseMananger_NEDB} from "../commons/DatabaseMananger_NEDB";

export class StoreProduct {
    constructor() {
        this.dbMananger_Product = new DatabaseMananger_NEDB("data/product.db");
    }

    async getProducts() {
        return await this.dbMananger_Product.find( /* {"name": ""} */ );
    }

}