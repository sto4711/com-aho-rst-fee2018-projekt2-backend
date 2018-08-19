import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";

export class StoreProduct {
    constructor() {
        this.dbMananger_Product = new DatabaseMananger_NEDB("data/product.db");
    }

    async getProducts(filterName) {
        if (filterName !== '') {
            return await this.dbMananger_Product.find({"searchTags": new RegExp(filterName.toLowerCase(), 'g')});
        }
        return await this.dbMananger_Product.find({});
    }

}