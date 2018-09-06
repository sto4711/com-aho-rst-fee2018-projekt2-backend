import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {Logger} from './commons/Logger';
import {RouterWebshop} from './router/RouterWebshop';

class WebshopBackend {
    constructor() {
        this.app = express();
        this.routerWebshop = new RouterWebshop();
        this.LOGGER_NAME = 'WebshopBackend';


        this.app.use((request, response, next) => {
            response.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');                     //enable CORS: frontend runs on localhost:63342
            response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            response.setHeader('Access-Control-Allow-Credentials', true);

            if (request.path.startsWith('/image')) {
                response.setHeader('Content-Type', 'image/png');
            }else   {
                response.setHeader('Content-Type', 'application/json; charset=utf-8');
            }

            next();
        });

        //Authentication
        this.app.use(async (request, response, next) => {
            request.authenticated = await this.routerWebshop.getControllerUser().isTokenValid(request);
            next();
        });

        //Trace URL
        this.app.use(async (request, response, next) => {
            if(!request.url.endsWith('jpg'))   {
                Logger.traceMessage(this.LOGGER_NAME, 'traceURL', request.url);
            }
            next();
        });

        this.app.use(express.static(path.resolve('public')));                   // images, etc
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use('/webshop', this.routerWebshop.getRouter());               // backend  -> http://localhost:3000/webshop
        this.app.listen(3000);
        Logger.traceMessage(this.LOGGER_NAME, 'constructor', 'Backend Webshop started: http://localhost:3000');
    }
}

new WebshopBackend();