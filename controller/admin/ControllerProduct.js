import {StoreProduct} from '../../service/admin/StoreProduct';
import {Logger} from "../../commons/Logger";

export class ControllerProduct {
    constructor() {
        this.storeProduct = new StoreProduct();
    }

    async getProducts(request, response)  {
        try {
            response.json(await this.storeProduct.getProducts(request.query.filterName));
            Logger.traceMessage('ControllerProduct', 'getProducts', 'ok');
        } catch (e) {
            Logger.traceError('ControllerProduct', 'getProducts', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

}