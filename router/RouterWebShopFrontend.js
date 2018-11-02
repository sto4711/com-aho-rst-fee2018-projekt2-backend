import express from 'express';
import path from 'path';

export class RouterWebShopFrontend {
    constructor() {
        this.router = express.Router(null);

        // catch 404 not found when frontend refresh page
        this.router.get('/*',  async (request, response) => {
            response.sendFile(path.resolve('public/frontend/index.html'));
        });
    }

    getRouter() {
        return this.router;
    }

}
