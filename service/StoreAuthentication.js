import UIDGenerator from 'uid-generator';
import {Logger} from "../commons/Logger";
import {DatabaseMananger_NEDB} from "../commons/DatabaseMananger_NEDB";

export class StoreAuthentication {
    constructor() {
        this.dbMananger_User = new DatabaseMananger_NEDB("data/user.db");
        this.dbMananger_Session = new DatabaseMananger_NEDB("data/session.db");
        this.dbMananger_Session.deleteAll();
    }

    async checkPwd(user, pwd) {
        const userData =  await this.dbMananger_User.find({"user": user, "pwd": pwd});
        if(userData.length == 0)   {
            Logger.traceError('StoreAuthentication','checkPwd','user and / or pwd not ok');
            throw "user and / or pwd not found";
        }
    }

    async generateToken() {
        this.uIDGenerator = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
        Logger.traceMessage('StoreAuthentication', 'generateToken', 'generated');
        return await this.uIDGenerator.generate();
    }

    async isTokenValid (tokenToCheck) {
        if(tokenToCheck==null)  {
            return false;
        }
        Logger.traceMessage('ServerContext', 'isTokenValid', 'Token is valid')
        return (tokenToCheck === this.token);
    }



}