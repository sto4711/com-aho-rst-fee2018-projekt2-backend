import {StoreAuthentication} from '../service/StoreAuthentication';
import {Logger} from "../commons/Logger";

export class ControllerAuthentification {
    constructor() {
        this.storeAuthentication = new StoreAuthentication();
        this.FEEDBACK_OK = JSON.parse('{"ok": 1}');
    }

    async signin(request, response) {
        try {
            const token = await this.storeAuthentication.setToken(request.body.user, request.body.pwd);
            Logger.traceMessage('ControllerAuthentification','signin','signin "' + request.body.user + '" ok');
            response.json({token: token});
        } catch (e) {
            Logger.traceError('ControllerAuthentification','signin','signin: ' + request.body.user + ' failed -> ' + e);
            //response.send(401, 'missing authorization header');
            response.status(401).send('user or pwd nok');
        }
    }

}