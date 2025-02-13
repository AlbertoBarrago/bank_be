"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAuth = configureAuth;
const errors_1 = require("../utils/errors");
async function configureAuth(app) {
    app.addHook('onRequest', async (request) => {
        try {
            if (request.url.startsWith('/api')) {
                await request.jwtVerify();
            }
        }
        catch (err) {
            throw new errors_1.AuthenticationError('Invalid token');
        }
    });
}
