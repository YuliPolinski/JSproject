import "./styles/auth.css";
import "./styles/command.css";
import "./styles/create-income-category.css";
import "./styles/income.css";
import "./styles/income-and-expenses.css";
import "./styles/main.css";
import {Router} from "./router.js";

export class App {
    constructor() {
        new Router();
    }
}

(new App());