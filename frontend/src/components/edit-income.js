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
exports.EditIncome = void 0;
const category_service_1 = require("../services/category-service");
const url_utils_1 = require("../utils/url-utils");
class EditIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.saveButton = document.getElementById("saveEditingIncome");
        this.cancelButton = document.getElementById("cancelEditIncome");
        ;
        this.titleInput = document.getElementById("newTitleIncome");
        this.categoryId = parseInt(url_utils_1.UrlUtils.getUrlParam("id"), 10);
        this.type = window.location.pathname.includes("income") ? "income" : "expense";
        if (!this.categoryId) {
            this.openNewRoute(`/${this.type}`).then();
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
            this.cancelButton.addEventListener("click", () => this.openNewRoute(`/${this.type}`));
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
                return;
            }
            this.openNewRoute(`/${this.type}`).then();
        });
    }
}
exports.EditIncome = EditIncome;
