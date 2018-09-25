import express from 'express';
import path from 'path';

export class RouterWebshopFrontend {
    constructor() {
        this.router = express.Router();

        // catch 404 not found when frontend refresh page
        this.router.get('/*',  async (request, response) => {
            debugger;
            console.log('request.url ' + request.url + '' + path );

            debugger;
            response.sendFile(path.resolve('public/frontend/index.html'));
            //response.sendfile(__dirname+'/../public/frontend/index.html');
            //response.sendFile('public/frontend/index.html', { root: __dirname });
        });

    }

    getRouter() {
        return this.router;
    }

}
