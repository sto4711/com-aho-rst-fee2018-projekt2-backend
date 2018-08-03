import Datastore from 'nedb-promise'

export class DatabaseMananger {
    constructor(filename) {
        this.db = new Datastore({filename: filename, autoload: true});
        console.log('Database ' + filename.replace(".db", "") + ' ready');
    }

    async insert(row) {
        return await this.db.insert(row);
    }

    async update(id, set) {
        await this.db.update({_id: id}, {$set: set});
    }

    async find(filter) {
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