import { CategoryService } from "../services/category-service";
import { OperationService } from "../services/operation-service";

export class CreateIncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.init();

    }

    async init() {
        this.typeInput = document.getElementById("type-input");
        this.categoryInput = document.getElementById("category-input");
        this.amountInput = document.getElementById("amount-input");
        this.dateInput = document.getElementById("date-input");
        this.commentInput = document.getElementById("comment-input");
        this.createButton = document.getElementById("createIncome");
        this.cancelButton = document.getElementById("cancelIncome");

        if (!this.typeInput || !this.categoryInput || !this.amountInput || !this.dateInput || !this.createButton || !this.cancelButton) {
            return;
        }

        await this.loadCategories();

        this.typeInput.addEventListener("change", async () => {
            await this.loadCategories();
        });

        this.categoryInput.addEventListener("change", () => {
            const selectedOption = this.categoryInput.options[this.categoryInput.selectedIndex];

            if (selectedOption) {
                const category = {
                    id: selectedOption.value,
                    title: selectedOption.textContent
                };

                localStorage.setItem("selectedCategory", JSON.stringify(category));
            }
        });

        this.createButton.addEventListener("click", this.createOperation.bind(this));
        this.cancelButton.addEventListener("click", () => this.openNewRoute("/income-expenses"));
    }

    async loadCategories() {
        this.categoryInput = document.getElementById("category-input");
        this.typeInput = document.getElementById("type-input");

        if (!this.categoryInput || !this.typeInput) {
            return;
        }

        const type = this.typeInput.value;
        const response = await CategoryService.getCategories(type);

        if (response.error) {
            console.error(response.error);
            return;
        }

        this.categoryInput.innerHTML = '<option value="" disabled selected>Выберите категорию</option>';

        response.categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = category.title;
            this.categoryInput.appendChild(option);

            sessionStorage.setItem(`category_${category.id}`, JSON.stringify(category));
        });

        console.log(response.categories);
    }

    async createOperation(e) {
        e.preventDefault();

        if (!this.categoryInput.value) {
            return;
        }

        const selectedOption = this.categoryInput.options[this.categoryInput.selectedIndex];
        const category = {
            id: selectedOption.value,
            title: selectedOption.textContent
        };

        const data = {
            type: this.typeInput.value,
            category: category.id,
            amount: parseFloat(this.amountInput.value),
            date: this.dateInput.value,
            comment: this.commentInput.value.trim()
        };

        const response = await OperationService.createOperation(data);
        if (response.error) {
            return;
        }


        sessionStorage.setItem(`operation_category_${response.response.id}`, JSON.stringify(category));

        console.log(response.response.id);

        this.openNewRoute("/income-expenses");
    }

}
