import {OperationService} from "../services/operation-service";
import {UrlUtils} from "../utils/url-utils";
import {CategoryService} from "../services/category-service";
import {HttpResponseType} from "../types/http-response.type";
import {OperationRequestType, OperationsType} from "../types/operations.type";
import {CategoryType} from "../types/category.type";

export class EditIncomeExpenses {

    public openNewRoute: (url: string) => Promise<void>;
    readonly operationId: number;
    readonly typeInput: HTMLSelectElement;
    private categoryInput: HTMLSelectElement;
    readonly amountInput: HTMLInputElement;
    readonly dateInput: HTMLInputElement;
    private commentInput: HTMLInputElement;
    readonly saveButton: HTMLButtonElement;
    readonly cancelButton: HTMLButtonElement;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.operationId = parseInt(UrlUtils.getUrlParam("id") || '', 10);

        this.typeInput = document.getElementById("type-input") as HTMLSelectElement;
        this.categoryInput = document.getElementById("category-input") as HTMLSelectElement;
        this.amountInput = document.getElementById("amount-input") as HTMLInputElement;
        this.dateInput = document.getElementById("date-input") as HTMLInputElement;
        this.commentInput = document.getElementById("comment-input") as HTMLInputElement;
        this.saveButton = document.getElementById("createIncome") as HTMLButtonElement;
        this.cancelButton = document.getElementById("cancelIncome") as HTMLButtonElement;

        if (!this.operationId) {
            this.openNewRoute("/income-expenses").then();
            return;
        }

        this.init().then();
    }

    public async init(): Promise<void> {

        if (!this.typeInput || !this.categoryInput || !this.amountInput || !this.dateInput || !this.saveButton || !this.cancelButton) {
            console.error("не найдены элементы формы.");
            return;
        }

        this.saveButton.addEventListener("click", this.updateOperation.bind(this));
        this.cancelButton.addEventListener("click", () => this.openNewRoute("/income-expenses"));

        await this.loadOperation();
    }


    private async loadOperation(): Promise<void> {
        const response: HttpResponseType<OperationsType> = await OperationService.getOperation(this.operationId);
        if (response.error) {
            console.error(response.error);
            return;
        }

        const operation: OperationsType | null = response.response;

        if (!operation) {
            return;
        }


        const typeMapping: Record<'income' | 'expense', string> = {
            "income": "Доход",
            "expense": "Расход"
        };

        const savedCategory = sessionStorage.getItem(`operation_category_${this.operationId}`)
            ? JSON.parse(sessionStorage.getItem(`operation_category_${this.operationId}`)!) as { id: string }
            : null;

        if (savedCategory) {
            this.categoryInput.value = savedCategory.id;
        }

        this.typeInput.value = operation.type;
        this.typeInput.options[this.typeInput.selectedIndex].innerText = typeMapping[operation.type];

        this.amountInput.value = String(operation.amount);
        this.dateInput.value = OperationService.reverseFormatDate(operation.date);
        this.commentInput.value = operation.comment || "";

        await this.loadCategories(operation.type, operation.category);
    }

    private async loadCategories(type: string, selectedCategoryId?: string): Promise<void> {
        this.categoryInput = document.getElementById("category-input") as HTMLSelectElement;
        ;
        if (!this.categoryInput) return;

        const response: HttpResponseType<CategoryType[]> = await CategoryService.getCategories(type);
        if (response.error) {
            console.error(response.error);
            return;
        }

        this.categoryInput.innerHTML = '<option value="" disabled>Выберите категорию</option>';

        response.response?.forEach((category: CategoryType) => {
            const option = document.createElement("option");
            option.value = String(category.id);
            option.textContent = category.title;
            this.categoryInput.appendChild(option);
        });

        if (selectedCategoryId) {
            this.categoryInput.value = selectedCategoryId;
        }
    }

    private async updateOperation(e: Event): Promise<void> {
        e.preventDefault();

        let rawDate: string = this.dateInput.value.trim();

        let formattedDate: string;
        if (rawDate.includes("-")) {
            const [first, second, third]: string[] = rawDate.split("-");

            if (first.length === 4) {
                formattedDate = rawDate;
            } else {
                formattedDate = OperationService.reverseFormatDate(rawDate);
            }
        } else {
            console.error(rawDate);
            return;
        }
        const typeString = this.typeInput.value;
        if (typeString !== 'income' && typeString !== 'expense') {
            throw new Error(`Недопустимое значение type: ${typeString}`);
        }

        const data: OperationRequestType = {
            type: typeString,
            category: this.categoryInput.value,
            amount: parseFloat(this.amountInput.value),
            date: formattedDate,
            comment: this.commentInput.value.trim()
        };


        const response: HttpResponseType<OperationsType> = await OperationService.updateOperation(this.operationId, data);
        if (response.error) {
            console.error(response.error);
            return;
        }

        this.openNewRoute("/income-expenses").then();
    }

}
