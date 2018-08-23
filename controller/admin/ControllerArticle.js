import {StoreArticle} from '../../service/admin/StoreArticle';
import {Logger} from "../../commons/Logger";

export class ControllerArticle {
    constructor() {
        this.storeProduct = new StoreArticle();
    }

    async getArticles(request, response)  {

        try {
            response.json(await this.storeProduct.getArticles(request.query.filterName));
            Logger.traceMessage('ControllerArticle', 'getArticles', 'ok');
        } catch (e) {
            Logger.traceError('ControllerArticle', 'getArticles', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async getAllArticles(request, response)  {
        try {
            response.json(await this.storeProduct.getAllArticles(request.query));
            Logger.traceMessage('ControllerArticle', 'getArticles', 'ok');
        } catch (e) {
            Logger.traceError('ControllerArticle', 'getArticles', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }


}