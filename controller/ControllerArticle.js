import {StoreArticle} from '../service/article/StoreArticle';
import {Logger} from "../commons/Logger";

export class ControllerArticle {
    constructor() {
        this.storeArticle = new StoreArticle();
        this.LOGGER_NAME = 'ControllerArticle';
    }

    getStoreArticle()   {
        return this.storeArticle;
    }

    async getArticles(request, response)  {
        try {
            const filter = request.query.filter ;

            const result = await this.storeArticle.getArticles( (filter==null? '' : filter)  );
            Logger.traceMessage(this.LOGGER_NAME, 'getArticles', 'count articles ' + result.length );
            response.json(result);

            //response.json(await this.storeArticle.getArticles( (filter==null? '' : filter)  ));
            Logger.traceMessage(this.LOGGER_NAME, 'getArticles', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'getArticles', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async getArticlesNewest(request, response)  {
        try {
            response.json(await this.storeArticle.getArticlesOrderByLimited('releaseDate', 'desc', request.query.limit));
            Logger.traceMessage(this.LOGGER_NAME, 'getArticlesNewest', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'getArticlesNewest', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async getArticleDetails(request, response)  {
        try {
            response.json(await this.storeArticle.getArticleDetails(request.query.id));
            Logger.traceMessage(this.LOGGER_NAME, 'getArticleDetails', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'getArticleDetails', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }



}