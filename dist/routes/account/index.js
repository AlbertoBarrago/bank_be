"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = accountRoutes;
const handlers_1 = require("./handlers");
const schemas_1 = require("./schemas");
async function accountRoutes(app) {
    const handlers = new handlers_1.AccountHandlers(app);
    app.post('/', { schema: schemas_1.createAccountSchema }, handlers.createAccount.bind(handlers));
    app.get('/:id', { schema: schemas_1.getAccountSchema }, handlers.getAccount.bind(handlers));
}
