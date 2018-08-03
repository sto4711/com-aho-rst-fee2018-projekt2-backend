import UIDGenerator from 'uid-generator';
import {Logger} from "./Logger";

/* Singleton */
export class ServerContext {
    constructor() {
        if(!ServerContext.instance){
            this.init();
            ServerContext.instance = this;
            Logger.traceMessage('ServerContext', 'constructor', 'Singleton instance created');
        }
        return ServerContext.instance;
    }

    async init()  {
        this.uIDGenerator = new UIDGenerator(); // Default is a 128-bit UID encoded in base58
        this.token = await this.uIDGenerator.generate();
        Logger.traceMessage('ServerContext', 'init', 'Token generated');
    }

    getToken () {
        return this.token;
    }

    isTokenValid (tokenToCheck) {
        if(tokenToCheck==null)  {
            return false;
        }
        Logger.traceMessage('ServerContext', 'isTokenValid', 'Token is valid')
        return (tokenToCheck === this.token);
    }

}