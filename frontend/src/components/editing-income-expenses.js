import { OperationService } from "../services/operation-service";
import { UrlUtils } from "../utils/url-utils";
import {CategoryService} from "../services/category-service";

export class EditIncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.operationId = UrlUtils.getUrlParam("id");

        if (!this.operationId) {
            alert("Ошибка: ID операции не найден!");
            this.openNewRoute("/income-expenses");
            return;
        }

        this.init();
    }

    async init() {
        this.typeInput = document.getElementById("type-input");
        this.categoryInput = document.getElementById("category-input");
        this.amountInput = document.getElementById("amount-input");
        this.dateInput = document.getElementById("date-input");
        this.commentInput = document.getElementById("comment-input");
        this.saveButton = document.getElementById("createIncome");
        this.cancelButton = document.getElementById("cancelIncome");

        if (!this.typeInput || !this.categoryInput || !this.amountInput || !this.dateInput || !this.saveButton || !this.cancelButton) {
            console.error("не найдены элементы формы.");
            return;
        }

        this.saveButton.addEventListener("click", this.updateOperation.bind(this));
        this.cancelButton.addEventListener("click", () => this.openNewRoute("/income-expenses"));

        await this.loadOperation();
    }


    async loadOperation() {
        const response = await OperationService.getOperation(this.operationId);
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

        const savedCategory = JSON.parse(sessionStorage.getItem(`operation_category_${this.operationId}`));

        if (savedCategory) {
            this.categoryInput.value = savedCategory.id;
        }

        this.typeInput.value = operation.type;
        this.typeInput.options[this.typeInput.selectedIndex].innerText = typeMapping[operation.type];

        this.amountInput.value = operation.amount;
        this.dateInput.value = OperationService.reverseFormatDate(operation.date);
        this.commentInput.value = operation.comment || "";

        await this.loadCategories(operation.type, operation.category);
    }

    async loadCategories(type, selectedCategoryId) {
        this.categoryInput = document.getElementById("category-input");
        if (!this.categoryInput) return;

        const response = await CategoryService.getCategories(type);
        if (response.error) {
            console.error(response.error);
            return;
        }

        this.categoryInput.innerHTML = '<option value="" disabled>Выберите категорию</option>';

        response.categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.title;
            this.categoryInput.appendChild(option);
        });

        if (selectedCategoryId) {
            this.categoryInput.value = selectedCategoryId;
        }
    }

    async updateOperation(e) {
        e.preventDefault();

        let rawDate = this.dateInput.value.trim();

        let formattedDate;
        if (rawDate.includes("-")) {
            const [first, second, third] = rawDate.split("-");

            if (first.length === 4) {
                formattedDate = rawDate;
            } else {
                formattedDate = OperationService.reverseFormatDate(rawDate);
            }
        } else {
            console.error(rawDate);
            return;
        }

        const data = {
            type: this.typeInput.value,
            category: this.categoryInput.value,
            amount: parseFloat(this.amountInput.value),
            date: formattedDate,
            comment: this.commentInput.value.trim()
        };


        const response = await OperationService.updateOperation(this.operationId, data);
        if (response.error) {
            console.error(response.error);
            return;
        }

        this.openNewRoute("/income-expenses");
    }

}
