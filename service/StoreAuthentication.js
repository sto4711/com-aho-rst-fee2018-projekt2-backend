import UIDGenerator from 'uid-generator';
import {Logger} from "../commons/Logger";
import {DatabaseMananger_NEDB} from "../commons/DatabaseMananger_NEDB";
import {Session} from "../service/Session";


export class StoreAuthentication {
    constructor() {
        this.uIDGenerator = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
        this.dbMananger_User = new DatabaseMananger_NEDB("data/user.db");
        this.dbMananger_Session = new DatabaseMananger_NEDB("data/session.db");
        this.dbMananger_Session.deleteAll();
    }

    async getUserID(user, pwd) {
        const userArr = await this.dbMananger_User.find({"user": user, "pwd": pwd});
        if (userArr.length == 0) {
            Logger.traceError('StoreAuthentication', 'getUserID', 'user and / or pwd not ok');
            throw "user and / or pwd not found";
        }
        return userArr[0]._id;
    }

    async getSession(userID) {
        const sessionArr = await this.dbMananger_Session.find({"userID": userID});
        return (sessionArr.length == 0 ? null : sessionArr[0]);
    }

    async getSessionTokenDate(token) {
        const sessionArr = await this.dbMananger_Session.find({"token": token});
        return (sessionArr.length == 0 ? null : sessionArr[0].tokenDate);
    }

    async generateToken() {
        const token = await this.uIDGenerator.generate();
        Logger.traceMessage('StoreAuthentication', 'generateToken', 'generated');
        return token;
    }

    async insertSession(userID, token) {
        await this.dbMananger_Session.insert(new Session(userID, token));
        Logger.traceMessage('StoreAuthentication', 'insertSession', 'session inserted');
    }

    async updateSessionToken(sessionID, token) {
        await this.dbMananger_Session.update(sessionID, {"token": token, "tokenDate": Date.now()});
        Logger.traceMessage('StoreAuthentication', 'updateSessionToken', 'session.token & tokenDate updated');
    }

}