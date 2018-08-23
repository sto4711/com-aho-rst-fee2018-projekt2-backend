import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";

export class StoreArticle {
    constructor() {
        this.dbMananger_Product = new DatabaseMananger_NEDB("data/article.db");
    }

    async getArticles(filterName) {
        if (filterName !== '') {
            return await this.dbMananger_Product.find({"searchTags": new RegExp(filterName.toLowerCase(), 'g')});
        }
        return await this.dbMananger_Product.find({});
    }
    async getAllArticles(filterName) {

        return await this.dbMananger_Product.find({});
    }
}