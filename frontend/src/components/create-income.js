import { CategoryService } from "../services/category-service";

export class CreateIncome {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.type = "income";

        document.getElementById("createIncome").addEventListener("click", this.createCategory.bind(this));
        document.getElementById("cancelIncome").addEventListener("click", () => this.openNewRoute("/income"));
    }

    async createCategory(e) {
        e.preventDefault();

        const input = document.getElementById("newIncome");
        if (!input.value.trim()) {
            return;
        }

        const response = await CategoryService.createCategory(this.type, { title: input.value.trim() });

        if (response.error) {
            alert(response.error);
            return;
        }

        this.openNewRoute("/income");
    }
}