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
exports.Income = void 0;
const category_service_1 = require("../services/category-service");
class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.loadCategories().then();
    }
    loadCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield category_service_1.CategoryService.getCategories("income");
            if (response.error || !response.response) {
                console.error(response.error);
                return;
            }
            this.renderCategories(response.response);
        });
    }
    renderCategories(categories) {
        const container = document.getElementById("incomeCategoryBox");
        if (!container) {
            return;
        }
        container.innerHTML = "";
        categories.forEach((category) => {
            const categoryElement = document.createElement("div");
            categoryElement.className = "col-md-4";
            categoryElement.innerHTML = `
                <div class="card p-3 shadow-sm">
                    <h5>${category.title}</h5>
                    <div class="d-flex mt-3 gap-1">
                        <a href="javascript:void(0)" class="btn-edit btn btn-primary btn-sm" data-id="${category.id}">Редактировать</a>
                        <button class="btn-delete btn btn-danger btn-sm" data-id="${category.id}">Удалить</button>
                    </div>
                </div>
            `;
            container.appendChild(categoryElement);
        });
        const addCategoryElement = document.createElement("div");
        addCategoryElement.className = "col-md-4";
        addCategoryElement.innerHTML = `
            <div class="card p-3 shadow-sm d-flex justify-content-center align-items-center">
                <a href="/create-income" class="btn btn-lg">+</a>
            </div>
        `;
        container.appendChild(addCategoryElement);
        this.initEventListeners();
    }
    initEventListeners() {
        document.querySelectorAll(".btn-edit").forEach((button) => {
            button.addEventListener("click", (event) => {
                const target = event.target;
                const categoryId = parseInt(target.getAttribute("data-id"), 10);
                if (categoryId) {
                    this.openNewRoute(`/editing-income?id=${categoryId}`).then();
                }
            });
        });
        document.querySelectorAll(".btn-delete").forEach((button) => {
            button.addEventListener("click", (event) => this.showDeleteDialog(event));
        });
    }
    showDeleteDialog(event) {
        const dialog = document.getElementById("dialog");
        const confirmDelete = document.getElementById("confirmDelete");
        const cancelDelete = document.getElementById("cancelDelete");
        const target = event.target;
        const categoryId = parseInt(target.getAttribute("data-id"), 10);
        if (!dialog || !confirmDelete || !cancelDelete || !categoryId) {
            return;
        }
        dialog.style.display = "flex";
        cancelDelete.onclick = () => (dialog.style.display = "none");
        confirmDelete.onclick = () => __awaiter(this, void 0, void 0, function* () {
            yield this.deleteCategory(categoryId);
            dialog.style.display = "none";
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield category_service_1.CategoryService.deleteCategory("income", id);
            if (!response.error) {
                const cardElement = (_a = document.querySelector(`[data-id="${id}"]`)) === null || _a === void 0 ? void 0 : _a.closest(".col-md-4");
                if (cardElement) {
                    cardElement.remove();
                }
            }
            else {
                console.error(response.error);
            }
        });
    }
}
exports.Income = Income;
