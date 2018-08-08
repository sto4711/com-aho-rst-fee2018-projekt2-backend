import {StoreAuthentication} from '../service/StoreAuthentication';
import {Logger} from '../commons/Logger';

export class ControllerAuthentication {
    constructor() {
        this.storeAuthentication = new StoreAuthentication();
        this.HOUR = 1000 * 60 * 60;//ms
    }

    async signin(request, response) {
        try {
            const userID = await this.storeAuthentication.getUserID(request.body.user, request.body.pwd);
            const session = await this.storeAuthentication.getSession(userID);
            let token = null;
            if (session == null) {
                token = await this.storeAuthentication.generateToken();
                await this.storeAuthentication.insertSession(userID, token);
                Logger.traceMessage('ControllerAuthentification', 'signin', 'user "' + request.body.user + '" -> no session found, new one created');
            } else if (Date.now() > (session.tokenDate + this.HOUR)) {
                token = await this.storeAuthentication.generateToken();
                await this.storeAuthentication.updateSessionToken(session._id, token);
                Logger.traceMessage('ControllerAuthentification', 'signin', 'user "' + request.body.user + '" -> session expired, token renewed');
            } else {
                token = session.token;
                Logger.traceMessage('ControllerAuthentification', 'signin', 'user "' + request.body.user + '" -> session not expired');
            }
            response.json({token: token});
        } catch (e) {
            Logger.traceError('ControllerAuthentification', 'signin', 'user"' + request.body.user + '" failed -> ' + e);
            response.status(401).send('user or pwd nok');
        }
    }

    async isTokenValid (request) {
        const token = request.headers.authorization;
        if(token == null)    {
            return false;
        }

        const tokenDate = await this.storeAuthentication.getSessionTokenDate(token);
        return Date.now() < (tokenDate + this.HOUR);
    }

    // async checkToken(request, response) {
    //     let valid = false;
    //
    //     if (request.headers.authorization != null) {
    //         const tokenDate = await this.storeAuthentication.getSessionTokenDate(request.headers.authorization);
    //         valid = Date.now() < (tokenDate + this.HOUR);
    //     }
    //
    //     if (!valid) {
    //         response.status(401).send('user or pwd nok');
    //         return false;
    //     }
    //     return true;
    // }

}