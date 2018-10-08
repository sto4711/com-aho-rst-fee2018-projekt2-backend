import {DatabaseMananger_NEDB} from "../../commons/DatabaseMananger_NEDB";
import {ShoppingBasket} from "../shopping-basket/ShoppingBasket";
import {Logger} from "../../commons/Logger";


export class StoreUser {
    constructor() {
        this.dbMananger_User = new DatabaseMananger_NEDB("data/user.db");
    }

    async getUser(userId) {
        const userArr = await this.dbMananger_User.find({"_id": userId});
        return (userArr.length === 0 ? null : userArr[0]);
    }

    async getUser_ByMailPwd(email, pwd) {
        const userArr = await this.dbMananger_User.find({"email": email, "pwd": pwd});
        return (userArr.length === 0 ? null : userArr[0]);
    }

    async getUsers() {
        return await this.dbMananger_User.find( /* {"name": ""} */ );
    }

    async update(user) {
        const userUpdated = await this.dbMananger_User.update(user._id, user);
        return userUpdated;
    }

    async create(user) {
        const userNew = await this.dbMananger_User.insert(user);
        return userNew;
    }



}