import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";


export class StoreUser {
    constructor() {
        this.dbMananger_User = new DatabaseMananger_NEDB("data/user.db");
    }

    async getUsers() {
        return await this.dbMananger_User.find( /* {"name": ""} */ );
    }

    async getUserID(email, pwd) {
        const userArr = await this.dbMananger_User.find({"email": email, "pwd": pwd});
        return (userArr.length === 0 ? null : userArr[0]._id);
    }

    async getUserID_ByMail(email) {
        const userArr = await this.dbMananger_User.find({"email": email});
        return (userArr.length === 0 ? null : userArr[0]._id);
    }



}