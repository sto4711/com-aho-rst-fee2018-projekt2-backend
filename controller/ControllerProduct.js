import {StoreAuthentication} from '../service/StoreAuthentication';
import {Logger} from "../commons/Logger";

export class ControllerProduct {
    constructor() {
        this.storeAuthentication = new StoreAuthentication();
        this.FEEDBACK_OK = JSON.parse('{"ok": 1}');
    }

    async getProducts(request, response) {
        // try {
        //     await this.storeAuthentication.checkPwd(request.body.user, request.body.pwd);
        //     Logger.traceMessage('ControllerAuthentification','signin','signin "' + request.body.user + '" ok');
        //     response.json({token: this.serverContext.getToken()});
        // } catch (e) {
        //     Logger.traceError('ControllerAuthentification','signin','signin: ' + request.body.user + ' failed -> ' + e);
        //     response.status(401).send('user or pwd nok');
        // }
    }

}