import {StoreSession} from '../service/user/StoreSession';
import {StoreUser} from '../service/user/StoreUser';
import {Logger} from '../commons/Logger';

export class ControllerUser {
    constructor() {
        this.HOUR = 1000 * 60 * 60;//ms
        this.LOGGER_NAME = 'ControllerUser';
        this.storeSession = new StoreSession();
        this.storeUser = new StoreUser();
    }

    getStoreSession()   {
        return this.storeSession;
    }

    getStoreUser()   {
        return this.storeUser;
    }

   async signIn(request, response) {
        try {
            const userID = await this.storeUser.getUserID(request.body.email, request.body.pwd);
            if (userID != null) {
                const session = await this.storeSession.getSessionByUser(userID);
                let token = null;
                if (session == null) {
                    token = await this.storeSession.createSession(userID);
                    Logger.traceMessage(this.LOGGER_NAME, 'signin', 'user "' + request.body.email + '" -> no session found, new one created');
                } else if (new Date().getTime() > (session.tokenDate.getTime() + this.HOUR)) {
                    token = await this.storeSession.renewSession(session._id);
                    Logger.traceMessage(this.LOGGER_NAME, 'signin', 'user "' + request.body.email + '" -> session expired, token renewed');
                } else {
                    token = session.token;
                }
                Logger.traceMessage(this.LOGGER_NAME, 'signin', 'user "' + request.body.email + '" ok');
                response.json({value: token});
            }
            else {
                Logger.traceError(this.LOGGER_NAME, 'signin', 'user"' + request.body.email + '" failed, user or pwd nok');
                response.status(401).send('user or pwd nok');
            }
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'signin', 'user"' + request.body.email + '" failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async create(request, response) {
        try {
            const userID = await this.storeUser.getUserID_ByMail(request.body.email);
            if(!userID)    {
                let user = request.body;
                user.type = 'customer';
                await this.storeUser.create(user);
                response.json(user);
            }else   {
                Logger.traceError(this.LOGGER_NAME, 'create', 'user already exists');
                response.status(401).send('user already exists');
            }
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'create', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async signOut(request, response) {
        const token = request.headers.authorization;
        try {
            if (token == null) {
                Logger.traceError(this.LOGGER_NAME, 'signOut', 'no token in header');
                response.status(404).send('no token in header');
            } else {
                const session = await this.storeSession.getSessionByToken(token);
                if (session == null) {
                    Logger.traceMessage(this.LOGGER_NAME, 'signOut', 'no session found for token "' + token + '" ok');
                    response.status(404).send('no session found');
                } else {
                    await this.storeSession.updateSessionTokenDate(session._id, new Date(Date.now() - this.HOUR));
                    Logger.traceMessage(this.LOGGER_NAME, 'signOut', 'ok');
                    response.json({status: 'ok'});
                }
            }
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'signOut', 'token"' + token + '" failed -> ' + e);
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
            Logger.traceMessage(this.LOGGER_NAME, 'isSessionValid', 'unknown token ' + token);
            return false;
        }

        const hasNotExpired = Date.now() < (tokenDate.getTime() + this.HOUR);
        if (!hasNotExpired) {
            Logger.traceMessage(this.LOGGER_NAME, 'isSessionValid', 'session not valid, token has expired');
        }
        return hasNotExpired;
    }

    async getUsers(request, response)  {
        try {
            response.json(await this.storeUser.getUsers());
            Logger.traceMessage(this.LOGGER_NAME, 'getUsers', 'ok');
        } catch (e) {
            Logger.traceError(this.LOGGER_NAME, 'getUsers', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

}