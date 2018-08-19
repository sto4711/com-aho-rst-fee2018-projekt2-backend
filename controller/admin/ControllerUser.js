import {StoreUser} from '../../service/admin/StoreUser';
import {Logger} from "../../commons/Logger";

export class ControllerUser {
    constructor() {
        this.storeUser = new StoreUser();
    }

    async getUsers(request, response)  {
        try {
            response.json(await this.storeUser.getUsers());
            Logger.traceMessage('ControllerUser', 'getUsers', 'ok');
        } catch (e) {
            Logger.traceError('ControllerUser', 'getUsers', 'failed -> ' + e);
            response.status(500).send('server error, contact support');
        }
    }

}