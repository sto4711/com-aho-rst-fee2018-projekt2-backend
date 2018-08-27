import {StoreArticle} from '../service/article/StoreArticle';
import {Logger} from "../commons/Logger";

export class ControllerArticle {
    constructor() {
        this.storeArticle = new StoreArticle();
    }

    async getArticles(request, response)  {
        try {
            const filter = request.query.filter ;
            response.json(await this.storeArticle.getArticles( (filter==null? '' : filter)  ));
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