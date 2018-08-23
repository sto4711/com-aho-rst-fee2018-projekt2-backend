import {StoreAuthentication} from '../../service/authentication/StoreAuthentication';
import {StoreUser} from '../../service/admin/StoreUser';
import {Logger} from '../../commons/Logger';

export class ControllerAuthenticationUser {
    constructor() {
        this.HOUR = 1000 * 60 * 60;//ms
        this.storeAuthentication = new StoreAuthentication();
        this.storeUser = new StoreUser();
    }

    async getUsers(request, response)  {
        try {
            response.json(await this.storeUser.getUsers());
            Logger.traceMessage('ControllerAuthenticationUser', 'getUsers', 'ok');
        } catch (e) {
            Logger.traceError('ControllerAuthenticationUser', 'getUsers', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

   async signIn(request, response) {
        console.log('request.body.email -> ' + request.body.email);
        console.log('request.body.pwd -> ' + request.body.pwd);

        try {
            const userID = await this.storeUser.getUserID(request.body.email, request.body.pwd);
            if (userID != null) {
                const session = await this.storeAuthentication.getSessionByUser(userID);
                let token = null;
                if (session == null) {
                    token = await this.storeAuthentication.createSession(userID);
                    Logger.traceMessage('ControllerAuthenticationUser', 'signin', 'user "' + request.body.email + '" -> no session found, new one created');
                } else if (new Date().getTime() > (session.tokenDate.getTime() + this.HOUR)) {
                    token = await this.storeAuthentication.renewSession(session._id);
                    Logger.traceMessage('ControllerAuthenticationUser', 'signin', 'user "' + request.body.email + '" -> session expired, token renewed');
                } else {
                    token = session.token;
                }
                Logger.traceMessage('ControllerAuthenticationUser', 'signin', 'user "' + request.body.email + '" ok');
                response.json({value: token});
            }
            else {
                Logger.traceError('ControllerAuthenticationUser', 'signin', 'user"' + request.body.email + '" failed, user or pwd nok');
                response.status(401).send('user or pwd nok');
            }
        } catch (e) {
            Logger.traceError('ControllerAuthenticationUser', 'signin', 'user"' + request.body.email + '" failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async signOut(request, response) {
        const token = request.headers.authorization;
        try {
            if (token == null) {
                Logger.traceError('ControllerAuthenticationUser', 'signOut', 'no token in header');
                response.json({status: 'no token in header'});
            } else {
                const session = await this.storeAuthentication.getSessionByToken(token);
                if (session == null) {
                    Logger.traceMessage('ControllerAuthenticationUser', 'signOut', 'no session found for token "' + token + '" ok');
                    response.json({status: 'no session found'});
                } else {
                    await this.storeAuthentication.updateSessionTokenDate(session._id, new Date(Date.now() - this.HOUR));
                    Logger.traceMessage('ControllerAuthentification', 'signOut', 'ok');
                    response.json({status: 'no'});
                }
            }
        } catch (e) {
            Logger.traceError('ControllerAuthenticationUser', 'signOut', 'token"' + token + '" failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async isTokenValid(request) {
        const token = request.headers.authorization;
        if (token == null) {
            return false;
        }

        const tokenDate = await this.storeAuthentication.getSessionTokenDate(token);
        if (tokenDate == null) {
            Logger.traceMessage('StoreAuthentication', 'isSessionValid', 'unknown token ' + token);
            return false;
        }

        const hasNotExpired = Date.now() < (tokenDate.getTime() + this.HOUR);
        if (!hasNotExpired) {
            Logger.traceMessage('StoreAuthentication', 'isSessionValid', 'session not valid, token has expired');
        }
        return hasNotExpired;
    }

}