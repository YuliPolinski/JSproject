import {CategoryService} from "../services/category-service";
import {OperationService} from "../services/operation-service";
import {CategoriesResponse, CategoryType} from "../types/category.type";
import {OperationRequestType, OperationResponseType} from "../types/operations.type";
import {HttpResponseType} from "../types/http-response.type";

export class CreateIncomeExpenses {

    public openNewRoute: (url: string) => Promise<void>;
    private typeInput: HTMLSelectElement;
    private categoryInput: HTMLSelectElement;
    readonly amountInput: HTMLInputElement;
    readonly dateInput: HTMLInputElement;
    private commentInput: HTMLInputElement;
    readonly createButton: HTMLButtonElement;
    readonly cancelButton: HTMLButtonElement;


    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;

        this.typeInput = document.getElementById("type-input") as HTMLSelectElement;
        this.categoryInput = document.getElementById("category-input") as HTMLSelectElement;
        this.amountInput = document.getElementById("amount-input") as HTMLInputElement;
        this.dateInput = document.getElementById("date-input") as HTMLInputElement;
        this.commentInput = document.getElementById("comment-input") as HTMLInputElement;
        this.createButton = document.getElementById("createIncome") as HTMLButtonElement;
        this.cancelButton = document.getElementById("cancelIncome") as HTMLButtonElement;

        this.init().then();

    }

    public async init(): Promise<void> {

        if (!this.typeInput || !this.categoryInput || !this.amountInput || !this.dateInput || !this.createButton || !this.cancelButton) {
            return;
        }

        await this.loadCategories();

        this.typeInput.addEventListener("change", async () => {
            await this.loadCategories();
        });

        this.categoryInput.addEventListener("change", () => {
            const selectedOption: HTMLOptionElement | undefined = this.categoryInput.options[this.categoryInput.selectedIndex];

            if (selectedOption && selectedOption.textContent !== null) {
                const category: { id: string; title: string } = {
                    id: selectedOption.value,
                    title: selectedOption.textContent
                };

                localStorage.setItem("selectedCategory", JSON.stringify(category));
            }
        });

        this.createButton.addEventListener("click", this.createOperation.bind(this));
        this.cancelButton.addEventListener("click", () => this.openNewRoute("/income-expenses"));
    }

    private async loadCategories(): Promise<void> {
        this.categoryInput = document.getElementById("category-input") as HTMLSelectElement;
        this.typeInput = document.getElementById("type-input") as HTMLSelectElement;

        if (!this.categoryInput || !this.typeInput) {
            return;
        }

        const type: string = this.typeInput.value;
        const response: CategoriesResponse = await CategoryService.getCategories(type);

        if (response.error) {
            console.error(response.error);
            return;
        }

        this.categoryInput.innerHTML = '<option value="" disabled selected>Выберите категорию</option>';

        if (!response.response) {
            return;
        }

        response.response.forEach((category) => {
            const option: HTMLOptionElement = document.createElement("option");
            option.value = category.id.toString();
            option.textContent = category.title;
            this.categoryInput.appendChild(option);

            sessionStorage.setItem(`category_${category.id}`, JSON.stringify(category));
        });

        console.log(response.response);
    }

    private async createOperation(e: Event): Promise<void> {
        e.preventDefault();

        if (!this.categoryInput.value) {
            return;
        }

        const selectedOption: HTMLOptionElement = this.categoryInput.options[this.categoryInput.selectedIndex];
        const category: CategoryType = {
            id: parseInt(selectedOption.value),
            title: selectedOption.textContent || '',
        };

        const data: OperationRequestType = {
            type: this.typeInput.value as "income" | "expense",
            category: selectedOption.value,
            amount: parseFloat(this.amountInput.value),
            date: this.dateInput.value,
            comment: this.commentInput.value.trim()
        };

        const response: HttpResponseType<OperationResponseType> = await OperationService.createOperation(data);
        if (response.error) {
            return;
        }

        if (!response.response) {
            return;
        }

        sessionStorage.setItem(`operation_category_${response.response.id}`, JSON.stringify(category));

        console.log(response.response.id);

        this.openNewRoute("/income-expenses").then();
    }

}
