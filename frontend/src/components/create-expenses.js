import {CategoryService} from "../services/category-service";

export class CreateExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.type = "expense";

        document.getElementById("createExpenses").addEventListener("click", this.createCategory.bind(this));
        document.getElementById("cancelExpenses").addEventListener("click", () => this.openNewRoute("/expenses"));
    }

    async createCategory(e) {
        e.preventDefault();

        const input = document.getElementById("newExpense");
        if (!input.value.trim()) {
            return;
        }

        const response = await CategoryService.createCategory(this.type, { title: input.value.trim() });

        if (response.error) {
            return;
        }

        this.openNewRoute("/expenses");
    }
}