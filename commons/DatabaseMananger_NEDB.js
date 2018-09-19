import Datastore from 'nedb-promise'
import {Logger} from "./Logger";

export class DatabaseMananger_NEDB {
    constructor(filename) {
        this.db = new Datastore({filename: filename, autoload: true});
        this.DESCENDING = -1;
        this.ASCENDING = 1;
        this.LOGGER_NAME = 'StoreShoppingBasket';
        Logger.traceMessage(this.LOGGER_NAME, 'constructor', 'Database "' + filename.replace('.db', '') + '" ready')
    }

    async insert(row) {
        return await this.db.insert(row);
    }

    async update(id, set) {
        await this.db.update({_id: id}, {$set: set});
    }

    async find(filter, sort, limit) {

        if(sort!==null && limit !==null)    {
            console.log(sort);
             return await this.db.cfind(filter).sort(sort).limit(limit).exec();
        }
        else if(sort!==null)    {

            return await this.db.cfind(filter).sort(sort).exec();
        }

        return await this.db.cfind(filter).exec();
    }

    async deleteAll() {
        return await this.db.remove({}, {multi: true});
    }

    async logAllItems() {
        const all = await this.find();
        for (let i = 0; i < all.length; i++) {
            console.log(JSON.stringify(all[i]));
        }
    }


}