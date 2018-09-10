import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";
import {Logger} from "../../commons/Logger";

export class StoreArticle {
    constructor() {
        this.dbMananger_Article = new DatabaseMananger_NEDB("data/article.db");
    }

    async getArticles(filterName) {
        if (filterName !== '') {
            return await this.dbMananger_Article.find({"searchTags": new RegExp(filterName.toLowerCase())});
        }
        return await this.dbMananger_Article.find({});
    }

    async getArticlesOrderByLimited(sort, ascDesc, limit) {
        const ascDesc_DB = (ascDesc.toLowerCase() === 'asc' ? this.dbMananger_Article.DESCENDING : this.dbMananger_Article.ASCENDING);
        return await this.dbMananger_Article.find({}, {"releaseDate": this.dbMananger_Article.DESCENDING}, limit);
    }

    async getArticleDetails(articleId, articleQueryParameter) {
        const articleArr = await this.dbMananger_Article.find((articleId? {"_id": articleId} : {"articleQueryParameter": articleQueryParameter}));
        return (articleArr.length === 0 ? null : articleArr[0]);
    }

    async update(article) {
        await this.dbMananger_Article.update(article._id, article);
    }

}