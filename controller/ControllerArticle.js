import {StoreArticle} from '../service/article/StoreArticle';
import {Logger} from "../commons/Logger";

export class ControllerArticle {
    constructor() {
        this.storeArticle = new StoreArticle();
    }

    getStoreArticle()   {
        return this.storeArticle;
    }

    async getArticles(request, response)  {
        try {
            const filter = request.query.filter ;
            response.json(await this.storeArticle.getArticles( (filter==null? '' : filter)  ));
            Logger.traceMessage('ControllerArticle', 'getArticles', 'ok');
        } catch (e) {
            Logger.traceError('ControllerArticle', 'getArticles', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async getArticlesNewest(request, response)  {
        try {
            response.json(await this.storeArticle.getArticlesOrderByLimited('releaseDate', 'desc', request.query.limit));
            Logger.traceMessage('ControllerArticle', 'getArticlesNewest', 'ok');
        } catch (e) {
            Logger.traceError('ControllerArticle', 'getArticlesNewest', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async getArticleDetails(request, response)  {
        try {
            response.json(await this.storeArticle.getArticleDetails(request.query.id));
            Logger.traceMessage('ControllerArticle', 'getArticleDetails', 'ok');
        } catch (e) {
            Logger.traceError('ControllerArticle', 'getArticleDetails', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }



}