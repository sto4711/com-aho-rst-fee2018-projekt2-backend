import {StoreArticle} from '../service/article/StoreArticle';
import {Logger} from "../commons/Logger";

export class ControllerArticle {
    constructor() {
        this.storeArticle = new StoreArticle();
    }

    async getArticles(request, response)  {
        try {
            response.json(await this.storeArticle.getArticles(request.query.filterName));
            Logger.traceMessage('ControllerArticle', 'getArticles', 'ok');
        } catch (e) {
            Logger.traceError('ControllerArticle', 'getArticles', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async getAllArticles(request, response)  {
        try {
            response.json(await this.storeArticle.getAllArticles());
            Logger.traceMessage('ControllerArticle', 'getAllArticles', 'ok');
        } catch (e) {
            Logger.traceError('ControllerArticle', 'getAllArticles', 'failed -> ' + e);
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