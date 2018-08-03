import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import UIDGenerator from 'uid-generator';
import {Logger} from "./commons/Logger";
import {ServerContext} from "./commons/ServerContext";
import {RouterWebshop} from './router/RouterWebshop';

class WebshopBackend {
    constructor() {
        this.app = express();
        this.routerWebshop = new RouterWebshop();
        this.serverContext = new ServerContext();//Singleton!

        this.app.use((request, response, next) => {
            response.setHeader('Access-Control-Allow-Origin', 'http://localhost:63342');                     //enable CORS: frontend runs on localhost:63342
            response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            response.setHeader('Access-Control-Allow-Credentials', true);                                    //enable CORS

            response.setHeader('Content-Type', 'application/json; charset=utf-8');
            next();
        });
        //Authentification
        this.app.use((request, response, next) =>{
            request.authenticated = this.serverContext.isTokenValid(request.headers.authorization);
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