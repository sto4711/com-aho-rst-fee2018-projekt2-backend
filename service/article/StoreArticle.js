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

    async getArticlesOrderByLimited(sort, ascDesc, limit) {
        const ascDesc_DB = (ascDesc.toLowerCase()==='asc'? this.dbMananger_Product.DESCENDING: this.dbMananger_Product.ASCENDING);
        return await this.dbMananger_Product.find({}, {"releaseDate": this.dbMananger_Product.DESCENDING}, limit);
    }

    async getArticleDetails(id) {
        const articleArr =  await this.dbMananger_Product.find({"_id": id});
        return (articleArr.length === 0 ? null : articleArr[0]);
    }



}