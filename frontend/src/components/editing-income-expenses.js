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
exports.EditIncomeExpenses = void 0;
const operation_service_1 = require("../services/operation-service");
const url_utils_1 = require("../utils/url-utils");
const category_service_1 = require("../services/category-service");
class EditIncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.operationId = parseInt(url_utils_1.UrlUtils.getUrlParam("id") || '', 10);
        this.typeInput = document.getElementById("type-input");
        this.categoryInput = document.getElementById("category-input");
        this.amountInput = document.getElementById("amount-input");
        this.dateInput = document.getElementById("date-input");
        this.commentInput = document.getElementById("comment-input");
        this.saveButton = document.getElementById("createIncome");
        this.cancelButton = document.getElementById("cancelIncome");
        if (!this.operationId) {
            alert("Ошибка: ID операции не найден!");
            this.openNewRoute("/income-expenses").then();
            return;
        }
        this.init().then();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.typeInput || !this.categoryInput || !this.amountInput || !this.dateInput || !this.saveButton || !this.cancelButton) {
                console.error("не найдены элементы формы.");
                return;
            }
            this.saveButton.addEventListener("click", this.updateOperation.bind(this));
            this.cancelButton.addEventListener("click", () => this.openNewRoute("/income-expenses"));
            yield this.loadOperation();
        });
    }
    loadOperation() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield operation_service_1.OperationService.getOperation(this.operationId);
            if (response.error) {
                console.error(response.error);
                return;
            }
            const operation = response.response;
            if (!operation) {
                return;
            }
            const typeMapping = {
                "income": "Доход",
                "expense": "Расход"
            };
            // const savedCategory: { id: string} | null = JSON.parse(sessionStorage.getItem(`operation_category_${this.operationId}`));
            //
            // if (savedCategory) {
            //     this.categoryInput.value = savedCategory.id;
            // }
            const savedCategory = sessionStorage.getItem(`operation_category_${this.operationId}`)
                ? JSON.parse(sessionStorage.getItem(`operation_category_${this.operationId}`))
                : null;
            if (savedCategory) {
                this.categoryInput.value = savedCategory.id;
            }
            this.typeInput.value = operation.type;
            this.typeInput.options[this.typeInput.selectedIndex].innerText = typeMapping[operation.type];
            this.amountInput.value = String(operation.amount);
            this.dateInput.value = operation_service_1.OperationService.reverseFormatDate(operation.date);
            this.commentInput.value = operation.comment || "";
            yield this.loadCategories(operation.type, operation.category);
        });
    }
    loadCategories(type, selectedCategoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.categoryInput = document.getElementById("category-input");
            ;
            if (!this.categoryInput)
                return;
            const response = yield category_service_1.CategoryService.getCategories(type);
            if (response.error) {
                console.error(response.error);
                return;
            }
            this.categoryInput.innerHTML = '<option value="" disabled>Выберите категорию</option>';
            (_a = response.response) === null || _a === void 0 ? void 0 : _a.forEach((category) => {
                const option = document.createElement("option");
                option.value = String(category.id);
                option.textContent = category.title;
                this.categoryInput.appendChild(option);
            });
            if (selectedCategoryId) {
                this.categoryInput.value = selectedCategoryId;
            }
        });
    }
    updateOperation(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            let rawDate = this.dateInput.value.trim();
            let formattedDate;
            if (rawDate.includes("-")) {
                const [first, second, third] = rawDate.split("-");
                if (first.length === 4) {
                    formattedDate = rawDate;
                }
                else {
                    formattedDate = operation_service_1.OperationService.reverseFormatDate(rawDate);
                }
            }
            else {
                console.error(rawDate);
                return;
            }
            const typeString = this.typeInput.value;
            if (typeString !== 'income' && typeString !== 'expense') {
                throw new Error(`Недопустимое значение type: ${typeString}`);
            }
            const data = {
                type: typeString,
                category: this.categoryInput.value,
                amount: parseFloat(this.amountInput.value),
                date: formattedDate,
                comment: this.commentInput.value.trim()
            };
            const response = yield operation_service_1.OperationService.updateOperation(this.operationId, data);
            if (response.error) {
                console.error(response.error);
                return;
            }
            this.openNewRoute("/income-expenses").then();
        });
    }
}
exports.EditIncomeExpenses = EditIncomeExpenses;
