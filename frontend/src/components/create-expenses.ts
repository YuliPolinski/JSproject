import {CategoryService} from "../services/category-service";
import {CreateCategoryResponse} from "../types/category.type";

export class CreateExpenses {

    public openNewRoute: (url: string) => Promise<void>;
    readonly type: string;
    readonly createExpenseEl: HTMLButtonElement | null = null;
    readonly cancelExpenseEl: HTMLButtonElement | null = null;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.type = "expense";

        this.createExpenseEl = document.getElementById("createExpenses") as HTMLButtonElement | null;
        if (this.createExpenseEl) {
            this.createExpenseEl.addEventListener("click", this.createCategory.bind(this));
        }

        this.cancelExpenseEl = document.getElementById("cancelExpenses") as HTMLButtonElement | null;
        if (this.cancelExpenseEl) {
            this.cancelExpenseEl.addEventListener("click", () => this.openNewRoute("/expenses"));
        }
    }

    private async createCategory(e: Event): Promise<void> {
        e.preventDefault();

        const input = document.getElementById("newExpense") as HTMLInputElement;
        if (!input.value.trim()) {
            return;
        }

        const response: CreateCategoryResponse = await CategoryService.createCategory(this.type, {title: input.value.trim()});

        if (response.error) {
            return;
        }

        this.openNewRoute("/expenses").then();
    }
}