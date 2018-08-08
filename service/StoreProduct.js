import {Logger} from "../commons/Logger";
import {DatabaseMananger_NEDB} from "../commons/DatabaseMananger";

export class StoreProduct {
    constructor() {
        this.dbMananger_Product = new DatabaseMananger_NEDB("data/product.db");
        this.dbMananger_Category = new DatabaseMananger_NEDB("data/category.db");
    }

    async getProducts(category) {
        // join....
        const categoryID = await this.dbMananger_Category.find({"name": category});
        Logger.traceError('StoreProduct','getProducts','categoryID ' + categoryID);


        // const userData =  await this.dbMananger.find({"user": user, "pwd": pwd});
        // if(userData.length == 0)   {
        //     Logger.traceError('StoreAuthentication','checkPwd','user and / or pwd not ok');
        //     throw "user and / or pwd not found";
        // }
    }

}