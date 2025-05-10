"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
require("./styles/auth.css");
require("./styles/command.css");
require("./styles/create-income-category.css");
require("./styles/income.css");
require("./styles/income-and-expenses.css");
require("./styles/main.css");
const router_1 = require("./router");
class App {
    constructor() {
        new router_1.Router();
    }
}
exports.App = App;
(new App());
