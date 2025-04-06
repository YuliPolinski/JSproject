"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateExpenses = void 0;
const category_service_1 = require("../services/category-service");
class CreateExpenses {
    constructor(openNewRoute) {
        this.createExpenseEl = null;
        this.cancelExpenseEl = null;
        this.openNewRoute = openNewRoute;
        this.type = "expense";
        this.createExpenseEl = document.getElementById("createExpenses");
        if (this.createExpenseEl) {
            this.createExpenseEl.addEventListener("click", this.createCategory.bind(this));
        }
        this.cancelExpenseEl = document.getElementById("cancelExpenses");
        if (this.cancelExpenseEl) {
            this.cancelExpenseEl.addEventListener("click", () => this.openNewRoute("/expenses"));
        }
        // document.getElementById("createExpenses").addEventListener("click", this.createCategory.bind(this));
        // document.getElementById("cancelExpenses").addEventListener("click", () => this.openNewRoute("/expenses"));
    }
    createCategory(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const input = document.getElementById("newExpense");
            if (!input.value.trim()) {
                return;
            }
            const response = yield category_service_1.CategoryService.createCategory(this.type, { title: input.value.trim() });
            if (response.error) {
                return;
            }
            this.openNewRoute("/expenses").then();
        });
    }
}
exports.CreateExpenses = CreateExpenses;
