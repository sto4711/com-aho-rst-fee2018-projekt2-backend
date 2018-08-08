import {StoreAuthentication} from '../service/StoreAuthentication';
import {Logger} from "../commons/Logger";

export class ControllerAuthentication {
    constructor() {
        this.storeAuthentication = new StoreAuthentication();
    }

    async signin(request, response) {
        try {
            debugger;
            await this.storeAuthentication.checkPwd(request.body.user, request.body.pwd);
            const token =  this.storeAuthentication.generateToken();
            Logger.traceMessage('ControllerAuthentification','signin','signin "' + request.body.user + '" ok');
            response.json({token: token});
        } catch (e) {
            Logger.traceError('ControllerAuthentification','signin','signin: ' + request.body.user + ' failed -> ' + e);
            response.status(401).send('user or pwd nok');
        }
    }

    async isTokenValid (tokenToCheck) {
        Logger.traceMessage('ServerContext', 'isTokenValid', 'Token is valid');
        return true;
    }

}