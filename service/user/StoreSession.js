import UIDGenerator from 'uid-generator';
import {Logger} from "../../commons/Logger";
import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";
import {Session} from "../../service/user/Session";


export class StoreSession {
    constructor() {
        this.uIDGenerator = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
        this.dbMananger_Session = new DatabaseMananger_NEDB("data/session.db");
        this.dbMananger_Session.deleteAll();
        this.LOGGER_NAME = 'StoreSession';
    }

    async getSessionByUser(userID) {
        const sessionArr = await this.dbMananger_Session.find({"userID": userID});
        return (sessionArr.length === 0 ? null : sessionArr[0]);
    }

    async getSessionByToken(token) {
        const sessionArr = await this.dbMananger_Session.find({"token": token});
        return (sessionArr.length === 0 ? null : sessionArr[0]);
    }

    async createSession(userID) {
        const token = await this.uIDGenerator.generate();
        await this.dbMananger_Session.insert(new Session(userID, token));
        Logger.traceMessage(this.LOGGER_NAME, 'createSession', 'session created');
        return token;
    }

    async renewSession(sessionID) {
        const token = await this.uIDGenerator.generate();
        await this.dbMananger_Session.update(sessionID, {"token": token, "tokenDate": new Date()});
        Logger.traceMessage(this.LOGGER_NAME, 'renewSession', 'session.token & tokenDate updated');
        return token;
    }

    async updateSessionTokenDate(sessionID, tokenDate) {
        await this.dbMananger_Session.update(sessionID, {"tokenDate": tokenDate});
        Logger.traceMessage(this.LOGGER_NAME, 'updateSessionTokenDate', 'session.tokenDate updated');
    }

    async getSessionTokenDate(token) {
        const sessionArr = await this.dbMananger_Session.find({"token": token});
        return (sessionArr.length === 0 ? null : sessionArr[0].tokenDate);
    }



}