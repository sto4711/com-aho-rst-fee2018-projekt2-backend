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
    async getAllArticles() {

        return await this.dbMananger_Product.find({});
    }

    async getArticleDetais(id) {
        if (id !== '') {
            return await this.dbMananger_Product.find({"_id":id});
        }
        return await this.dbMananger_Product.find({});
    }

}