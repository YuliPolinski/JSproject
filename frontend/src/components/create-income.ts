import { CategoryService } from "../services/category-service";
import {CreateCategoryResponse} from "../types/category.type";

export class CreateIncome {

    public openNewRoute: (url: string) => Promise<void>;
    readonly type: string;
    readonly createIncomeEl: HTMLButtonElement | null = null;
    readonly cancelIncomeEl: HTMLButtonElement | null = null;


    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.type = "income";

        this.createIncomeEl = document.getElementById("createIncome") as HTMLButtonElement | null;
        if (this.createIncomeEl) {
            this.createIncomeEl.addEventListener("click", this.createCategory.bind(this));
        }
        this.cancelIncomeEl = document.getElementById("cancelIncome") as HTMLButtonElement | null;
        if (this.cancelIncomeEl) {
            this.cancelIncomeEl.addEventListener("click", () => this.openNewRoute("/income"));
        }
    }

    private async createCategory(e: Event): Promise<void> {
        e.preventDefault();

        const input = document.getElementById("newIncome") as HTMLInputElement;
        if (!input.value.trim()) {
            return;
        }

        const response: CreateCategoryResponse = await CategoryService.createCategory(this.type, { title: input.value.trim() });

        if (response.error) {
            alert(response.error);
            return;
        }

        this.openNewRoute("/income").then();
    }
}