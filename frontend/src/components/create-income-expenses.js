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
exports.CreateIncomeExpenses = void 0;
const category_service_1 = require("../services/category-service");
const operation_service_1 = require("../services/operation-service");
class CreateIncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.typeInput = document.getElementById("type-input");
        this.categoryInput = document.getElementById("category-input");
        this.amountInput = document.getElementById("amount-input");
        this.dateInput = document.getElementById("date-input");
        this.commentInput = document.getElementById("comment-input");
        this.createButton = document.getElementById("createIncome");
        this.cancelButton = document.getElementById("cancelIncome");
        this.init().then();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.typeInput || !this.categoryInput || !this.amountInput || !this.dateInput || !this.createButton || !this.cancelButton) {
                return;
            }
            yield this.loadCategories();
            this.typeInput.addEventListener("change", () => __awaiter(this, void 0, void 0, function* () {
                yield this.loadCategories();
            }));
            this.categoryInput.addEventListener("change", () => {
                const selectedOption = this.categoryInput.options[this.categoryInput.selectedIndex];
                // if (selectedOption) {
                //     const category: { id: string; title: string } = {
                //         id: selectedOption.value,
                //         title: selectedOption.textContent
                //     };
                //
                //     localStorage.setItem("selectedCategory", JSON.stringify(category));
                // }
                if (selectedOption && selectedOption.textContent !== null) {
                    const category = {
                        id: selectedOption.value,
                        title: selectedOption.textContent
                    };
                    localStorage.setItem("selectedCategory", JSON.stringify(category));
                }
            });
            this.createButton.addEventListener("click", this.createOperation.bind(this));
            this.cancelButton.addEventListener("click", () => this.openNewRoute("/income-expenses"));
        });
    }
    loadCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            this.categoryInput = document.getElementById("category-input");
            this.typeInput = document.getElementById("type-input");
            if (!this.categoryInput || !this.typeInput) {
                return;
            }
            const type = this.typeInput.value;
            const response = yield category_service_1.CategoryService.getCategories(type);
            if (response.error) {
                console.error(response.error);
                return;
            }
            this.categoryInput.innerHTML = '<option value="" disabled selected>Выберите категорию</option>';
            if (!response.response) {
                return;
            }
            response.response.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id.toString();
                option.textContent = category.title;
                this.categoryInput.appendChild(option);
                sessionStorage.setItem(`category_${category.id}`, JSON.stringify(category));
            });
            console.log(response.response);
        });
    }
    createOperation(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            if (!this.categoryInput.value) {
                return;
            }
            const selectedOption = this.categoryInput.options[this.categoryInput.selectedIndex];
            const category = {
                id: parseInt(selectedOption.value),
                title: selectedOption.textContent || '',
            };
            const data = {
                type: this.typeInput.value,
                category: selectedOption.value,
                amount: parseFloat(this.amountInput.value),
                date: this.dateInput.value,
                comment: this.commentInput.value.trim()
            };
            const response = yield operation_service_1.OperationService.createOperation(data);
            if (response.error) {
                return;
            }
            if (!response.response) {
                return;
            }
            sessionStorage.setItem(`operation_category_${response.response.id}`, JSON.stringify(category));
            console.log(response.response.id);
            this.openNewRoute("/income-expenses").then();
        });
    }
}
exports.CreateIncomeExpenses = CreateIncomeExpenses;
