import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";


export class StoreUser {
    constructor() {
        this.dbMananger_User = new DatabaseMananger_NEDB("data/user.db");
    }

    async getUsers() {
        return await this.dbMananger_User.find( /* {"name": ""} */ );
    }




}