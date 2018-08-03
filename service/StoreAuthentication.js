import {Logger} from "../commons/Logger";
import {DatabaseMananger} from "../commons/DatabaseMananger";

import UIDGenerator from 'uid-generator';

export class StoreAuthentication {
    constructor() {
        this.dbMananger = new DatabaseMananger("data/user.db");
        this.uIDGenerator = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
    }

    async setToken(user, pwd) {
        const userData =  await this.dbMananger.find({"user": user, "pwd": pwd});
        if(userData.length == 0)   {
            Logger.traceError('StoreAuthentication','setToken','user and / or pwd not found');
            throw "user and / or pwd not found";
        }
        //set new token
        userData.token = await this.uIDGenerator.generate();
        userData.tokenExpires = new Date().toJSON().split('T')[0];
        await this.dbMananger.update(userData._id,  {"token": userData.token, "tokenExpires": userData.tokenExpires } );
        Logger.traceMessage('StoreAuthentication','setToken','newToken set / updated');
        return userData.token;
    }


}