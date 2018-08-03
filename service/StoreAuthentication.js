import {Logger} from "../commons/Logger";
import {DatabaseMananger} from "../commons/DatabaseMananger";

export class StoreAuthentication {
    constructor() {
        this.dbMananger = new DatabaseMananger("data/user.db");
    }

    async checkPwd(user, pwd) {
        const userData =  await this.dbMananger.find({"user": user, "pwd": pwd});
        if(userData.length == 0)   {
            Logger.traceError('StoreAuthentication','checkPwd','user and / or pwd not ok');
            throw "user and / or pwd not found";
        }
    }

}