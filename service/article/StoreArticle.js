import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";

export class StoreArticle {
    constructor() {
        this.dbMananger_Product = new DatabaseMananger_NEDB("data/article.db");
    }

    async getArticles(filterName) {
        if (filterName !== '') {
            const articlesArr = await this.dbMananger_Product.find({"searchTags": new RegExp(filterName.toLowerCase(), 'g')});
            console.log('articlesArr.length ' + articlesArr.length);
            return articlesArr;
        }
        return await this.dbMananger_Product.find({});
    }

    async getArticleDetails(id) {
        return await this.dbMananger_Product.find({"_id": id});
    }



}