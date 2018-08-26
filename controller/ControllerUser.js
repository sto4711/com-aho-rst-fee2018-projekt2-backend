import {StoreSession} from '../service/user/StoreSession';
import {StoreUser} from '../service/user/StoreUser';
import {Logger} from '../commons/Logger';

export class ControllerUser {
    constructor() {
        this.HOUR = 1000 * 60 * 60;//ms
        this.storeSession = new StoreSession();
        this.storeUser = new StoreUser();
    }

    async isLoggedIn(request, response)  {
        try {
            const userID = await this.storeUser.getUserID_ByMail(request.query.email);
            let session = null;
            if (userID !== null) {
                session = await this.storeSession.getSessionByUser(userID);
            }

            if(session ===null)    {
                response.json({IsLoggedIn : false});
                Logger.traceMessage('ControllerUser', 'isLoggedIn', request.query.email + ' is not logged in');
            }
            else    {
                response.json({IsLoggedIn : true});
                Logger.traceMessage('ControllerUser', 'isLoggedIn', request.query.email + ' is logged in');
            }
        } catch (e) {
            Logger.traceError('ControllerUser', 'getIsLoggedIn', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

   async signIn(request, response) {
        try {
            const userID = await this.storeUser.getUserID(request.body.email, request.body.pwd);
            if (userID != null) {
                const session = await this.storeSession.getSessionByUser(userID);
                let token = null;
                if (session == null) {
                    token = await this.storeSession.createSession(userID);
                    Logger.traceMessage('ControllerUser', 'signin', 'user "' + request.body.email + '" -> no session found, new one created');
                } else if (new Date().getTime() > (session.tokenDate.getTime() + this.HOUR)) {
                    token = await this.storeSession.renewSession(session._id);
                    Logger.traceMessage('ControllerUser', 'signin', 'user "' + request.body.email + '" -> session expired, token renewed');
                } else {
                    token = session.token;
                }
                Logger.traceMessage('ControllerUser', 'signin', 'user "' + request.body.email + '" ok');
                response.json({value: token});
            }
            else {
                Logger.traceError('ControllerUser', 'signin', 'user"' + request.body.email + '" failed, user or pwd nok');
                response.status(401).send('user or pwd nok');
            }
        } catch (e) {
            Logger.traceError('ControllerUser', 'signin', 'user"' + request.body.email + '" failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async signOut(request, response) {
        const token = request.headers.authorization;
        try {
            if (token == null) {
                Logger.traceError('ControllerUser', 'signOut', 'no token in header');
                response.json({status: 'no token in header'});
            } else {
                const session = await this.storeSession.getSessionByToken(token);
                if (session == null) {
                    Logger.traceMessage('ControllerUser', 'signOut', 'no session found for token "' + token + '" ok');
                    response.json({status: 'no session found'});
                } else {
                    await this.storeSession.updateSessionTokenDate(session._id, new Date(Date.now() - this.HOUR));
                    Logger.traceMessage('ControllerAuthentification', 'signOut', 'ok');
                    response.json({status: 'no'});
                }
            }
        } catch (e) {
            Logger.traceError('ControllerUser', 'signOut', 'token"' + token + '" failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async isTokenValid(request) {
        const token = request.headers.authorization;
        if (token == null) {
            return false;
        }

        const tokenDate = await this.storeSession.getSessionTokenDate(token);
        if (tokenDate == null) {
            Logger.traceMessage('ControllerUser', 'isSessionValid', 'unknown token ' + token);
            return false;
        }

        const hasNotExpired = Date.now() < (tokenDate.getTime() + this.HOUR);
        if (!hasNotExpired) {
            Logger.traceMessage('ControllerUser', 'isSessionValid', 'session not valid, token has expired');
        }
        return hasNotExpired;
    }

    async getUsers(request, response)  {
        try {
            response.json(await this.storeUser.getUsers());
            Logger.traceMessage('ControllerUser', 'getUsers', 'ok');
        } catch (e) {
            Logger.traceError('ControllerUser', 'getUsers', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

}