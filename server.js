import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import UIDGenerator from 'uid-generator';
import {Logger} from "./commons/Logger";
import {RouterWebshop} from './router/RouterWebshop';

class WebshopBackend {
    constructor() {
        this.app = express();
        this.routerWebshop = new RouterWebshop();

        this.app.use((request, response, next) => {
            response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');                     //enable CORS: frontend runs on localhost:63342
            response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            response.setHeader('Access-Control-Allow-Credentials', true);

            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            next();
        });

        //Authentication
        this.app.use(async (request, response, next) => {
            request.authenticated = await this.routerWebshop.getControllerAuthentication().isTokenValid(request);
            next();
        });

        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use('/webshop', this.routerWebshop.getRouter());            // backend  -> http://localhost:3000/webshop
        this.app.listen(3000);
        Logger.traceMessage('WebshopApp', 'constructor', 'Backend Webshop started: http://localhost:3000');
    }
}

new WebshopBackend();