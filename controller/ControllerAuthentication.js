import {StoreAuthentication} from '../service/StoreAuthentication';
import {Logger} from '../commons/Logger';

export class ControllerAuthentication {
    constructor() {
        this.HOUR = 1000 * 60 * 60;//ms
        this.storeAuthentication = new StoreAuthentication();
    }

    async signIn(request, response) {
        try {
            const userID = await this.storeAuthentication.getUserID(request.body.user, request.body.pwd);
            if (userID != null) {
                const session = await this.storeAuthentication.getSessionByUser(userID);
                let token = null;
                if (session == null) {
                    token = await this.storeAuthentication.createSession(userID);
                    Logger.traceMessage('ControllerAuthentification', 'signin', 'user "' + request.body.user + '" -> no session found, new one created');
                } else {
                    const now = new Date();
                    const tokenDate = session.tokenDate;
                    console.log('n   ' + now + ' -> ' + now.getTime());
                    console.log('t   ' + tokenDate + ' -> ' + (tokenDate.getTime() + this.HOUR));

                    if (new Date().getTime() > (session.tokenDate.getTime() + this.HOUR)) {
                        token = await this.storeAuthentication.renewSession(session._id);
                        Logger.traceMessage('ControllerAuthentification', 'signin', 'user "' + request.body.user + '" -> session expired, token renewed');
                    } else {
                        token = session.token;
                        // await this.storeAuthentication.renewTokenDate(session._id);
                        // Logger.traceMessage('ControllerAuthentification', 'signin', 'user "' + request.body.user + '" -> session not expired, token renewed');
                    }
                }


                Logger.traceMessage('ControllerAuthentification', 'signin', 'user "' + request.body.user + '" ok');
                response.json({token: token});
            }
            else {
                Logger.traceError('ControllerAuthentification', 'signin', 'user"' + request.body.user + '" failed, user or pwd nok');
                response.status(401).send('user or pwd nok');
            }
        } catch (e) {
            Logger.traceError('ControllerAuthentification', 'signin', 'user"' + request.body.user + '" failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async signOut(request, response) {
        const token = request.headers.authorization;
        try {
            if (token == null) {
                Logger.traceError('ControllerAuthentification', 'signOut', 'no token in header');
                response.json({status: 'no token in header'});
            } else {
                const session = await this.storeAuthentication.getSessionByToken(token);
                if (session == null) {
                    Logger.traceMessage('ControllerAuthentification', 'signOut', 'no session found for token "' + token + '" ok');
                    response.json({status: 'no session found'});
                } else {
                    await this.storeAuthentication.updateSessionTokenDate(session._id, new Date(Date.now() - this.HOUR));
                    Logger.traceMessage('ControllerAuthentification', 'signOut', 'token "' + token + '" ok');
                    response.json({status: 'no'});
                }
            }
        } catch (e) {
            Logger.traceError('ControllerAuthentification', 'signOut', 'token"' + token + '" failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

    async isTokenValid(request) {
        const token = request.headers.authorization;
        if (token == null) {
            return false;
        }

        const tokenDate = await this.storeAuthentication.getSessionTokenDate(token);
        const hasNotExpired = Date.now() < (tokenDate.getTime() + this.HOUR);
        if (!hasNotExpired) {
            Logger.traceMessage('StoreAuthentication', 'isSessionValid', 'session not valid, token has expired');
        }
        return hasNotExpired;
    }

}