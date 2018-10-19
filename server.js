import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import {Logger} from './commons/Logger';
import {RouterWebshop} from './router/RouterWebshop';
import {RouterWebshopFrontend} from './router/RouterWebshopFrontend';
import {StoreUser} from "./service/user/StoreUser";

class WebshopBackend {
    constructor() {
        this.app = express();
        this.routerWebshop = new RouterWebshop();
        this.routerWebshopFrontend = new RouterWebshopFrontend();
        this.LOGGER_NAME = 'WebshopBackend';

        this.app.use((request, response, next) => {
            if (request.path.startsWith('/webshop')) {
                response.setHeader('Access-Control-Allow-Origin', '*');                     //enable CORS
                response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
                response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
                response.setHeader('Access-Control-Allow-Credentials', true);
                //response.setHeader('Content-Type', 'application/json; charset=utf-8');
            }
            /*
            else if (request.path.endsWith('.png')) {
                response.setHeader("Content-Type", "image/png");
            }
            else if (request.path.endsWith('.jpg')) {
                response.setHeader("Content-Type", "image/jpeg");
            }
            else if (request.path.endsWith('.gif')) {
                response.setHeader("Content-Type", "image/gif");
            }
            else if (request.path.endsWith('.css')) {
                response.setHeader("Content-Type", "text/css; charset=utf-8");
            }
            else if (request.path.endsWith('.js')) {
                response.setHeader("Content-Type", "application/javascript; charset=utf-8");
            }
            else {
                response.setHeader("Content-Type", "text/html; charset=utf-8");
            }
            */
            next();
        });

        //Authentication
        this.app.use(async (request, response, next) => {
            request.authenticated = await this.routerWebshop.getControllerUser().isTokenValid(request);
            next();
        });

        //Trace URL Backend only
        this.app.use(async (request, response, next) => {
            this.traceURL_Backend(request);
            next();
        });

        this.app.use(express.static(path.resolve('public')));                   // images, frontend
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use('/webshop', this.routerWebshop.getRouter());               // backend      -> http://localhost:3000/webshop
        this.app.use('/frontend', this.routerWebshopFrontend.getRouter());      // frontend     -> http://localhost:3000/frontend
        this.app.listen(3000);
        Logger.traceMessage(this.LOGGER_NAME, 'constructor', 'Backend  Webshop : http://localhost:3000/webshop');
        Logger.traceMessage(this.LOGGER_NAME, 'constructor', 'Frontend Webshop : http://localhost:3000/frontend');
    }

    traceURL_Backend(request) {
        if (request.path.startsWith('/webshop') && request.method !== 'OPTIONS') {
            Logger.traceMessage('WebshopBackend', 'traceURL_Backend', request.url + '     (' + request.method + ')');
        }
    }

}

//new StoreUser().hashExistingPWDs().then();
new WebshopBackend();