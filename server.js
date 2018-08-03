import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {Logger} from "./commons/Logger";
import {RouterWebshop} from './router/RouterWebshop';

class WebshopBackend {
    constructor() {
        this.app = express();
        this.app.use((request, response, next) => {
            response.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');                     //enable CORS: frontend runs on localhost:63342
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    //enable CORS
            response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');             //enable CORS
            response.setHeader('Access-Control-Allow-Credentials', true);                                    //enable CORS

            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            next();
        });
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use('/webshop', new RouterWebshop().getRouter());            // backend  -> http://localhost:3000/note
        this.app.listen(3000);
        Logger.traceMessage('WebshopApp','constructor','Backend Webshop started: http://localhost:3000');
    }
}

new WebshopBackend();