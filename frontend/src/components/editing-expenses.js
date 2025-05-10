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
exports.EditExpenses = void 0;
const url_utils_1 = require("../utils/url-utils");
const category_service_1 = require("../services/category-service");
class EditExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryId = parseInt(url_utils_1.UrlUtils.getUrlParam("id"), 10);
        this.type = window.location.pathname.includes("expenses") ? "expense" : "income";
        this.saveButton = document.getElementById("editingExpenses");
        this.cancelButton = document.getElementById("cancelExpenses");
        this.titleInput = document.getElementById("newTitleExpense");
        if (!this.categoryId) {
            this.openNewRoute(`/${this.type}s`).then();
            return;
        }
        this.init().then();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.saveButton || !this.cancelButton || !this.titleInput) {
                return;
            }
            this.saveButton.addEventListener("click", this.updateCategory.bind(this));
            this.cancelButton.addEventListener("click", () => this.openNewRoute(`/${this.type}s`));
            yield this.loadCategory();
        });
    }
    loadCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield category_service_1.CategoryService.getCategory(this.type, this.categoryId);
            if (response.error || !response.response || !this.titleInput) {
                return;
            }
            this.titleInput.value = response.response.title;
        });
    }
    updateCategory(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            if (!this.titleInput || !this.titleInput.value.trim()) {
                return;
            }
            const response = yield category_service_1.CategoryService.updateCategory(this.type, this.categoryId, { title: this.titleInput.value.trim() });
            if (response.error) {
                alert(response.error);
                return;
            }
            this.openNewRoute(`/${this.type}s`).then();
        });
    }
}
exports.EditExpenses = EditExpenses;
