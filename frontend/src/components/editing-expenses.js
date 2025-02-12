import {UrlUtils} from "../utils/url-utils";
import {CategoryService} from "../services/category-service";

export class EditExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.categoryId = UrlUtils.getUrlParam("id");
        this.type = window.location.pathname.includes("expenses") ? "expense" : "income";


        if (!this.categoryId) {
            this.openNewRoute(`/${this.type}s`);
            return;
        }

        this.init();
    }

    async init() {
        this.saveButton = document.getElementById("editingExpenses");
        this.cancelButton = document.getElementById("cancelExpenses");
        this.titleInput = document.getElementById("newTitleExpense");

        if (!this.saveButton || !this.cancelButton || !this.titleInput) {
            return;
        }

        this.saveButton.addEventListener("click", this.updateCategory.bind(this));
        this.cancelButton.addEventListener("click", () => this.openNewRoute(`/${this.type}s`));

        await this.loadCategory();
    }

    async loadCategory() {
        const response = await CategoryService.getCategory(this.type, this.categoryId);

        if (response.error) {
            alert(response.error);
            return;
        }

        this.titleInput.value = response.category.title;
    }

    async updateCategory(e) {
        e.preventDefault();

        if (!this.titleInput || !this.titleInput.value.trim()) {
            return;
        }

        const response = await CategoryService.updateCategory(this.type, this.categoryId, {title: this.titleInput.value.trim()});

        if (response.error) {
            alert(response.error);
            return;
        }

        this.openNewRoute(`/${this.type}s`);
    }
}