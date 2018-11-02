import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";
import {Logger} from "../../commons/Logger";
import {CryptoMananger} from "../../commons/CryptoMananger";


export class StoreUser {
    constructor() {
        this.LOGGER_NAME = 'StoreUser';
        this.dbMananger_User = new DatabaseMananger_NEDB("data/user.db");
    }

    async getUser(userId) {
        const userArr = await this.dbMananger_User.find({"_id": userId});
        return (userArr.length === 0 ? null : userArr[0]);
    }

    async getUser_ByMailPwd(email, pwd) {
        const userArr = await this.dbMananger_User.find({"email": email});
        for (let i = 0; i < userArr.length; i++) {
            const user = userArr[i];
            const hasSamePwd = await CryptoMananger.compare(pwd, user.pwd);
            if(hasSamePwd)    {
                user.pwd = 'XXX';
                return user;
            }
        }
        return null; // nothing found
    }

    async getUsers() {
        return await this.dbMananger_User.find(/* {"name": ""} */);
    }

    async update(user) {
        return await this.dbMananger_User.update(user._id, user);
    }

    async delete(user) {
        return await this.dbMananger_User.remove(user._id, user);
    }

    async create(user) {
        return await this.dbMananger_User.insert(user);
    }

    async hashExistingPWDs() {
        const userArr = await this.dbMananger_User.find();
        for (let i = 0; i < userArr.length; i++) {
            let user = userArr[i];
            let pwd = user.pwd;
            user.pwd = await CryptoMananger.createHash(pwd);
            await this.update(user);
            Logger.traceMessage(this.LOGGER_NAME, 'hashExistingPWDs', 'next pwd encrypted & stored into database');
        }
        Logger.traceMessage(this.LOGGER_NAME, 'hashExistingPWDs', 'start');
    }

}