import { CategoryService } from "../services/category-service";
import { UrlUtils } from "../utils/url-utils";


export class EditIncome {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;
        this.categoryId = UrlUtils.getUrlParam("id");

        this.type = window.location.pathname.includes("income") ? "income" : "expense";

        if (!this.categoryId) {
            this.openNewRoute(`/${this.type}`);
            return;
        }

        this.init();
    }

    async init() {
        this.saveButton = document.getElementById("saveEditingIncome");
        this.cancelButton = document.getElementById("cancelEditIncome");
        this.titleInput = document.getElementById("newTitleIncome");

        if (!this.saveButton || !this.cancelButton || !this.titleInput) {
            return;
        }

        this.saveButton.addEventListener("click", this.updateCategory.bind(this));
        this.cancelButton.addEventListener("click", () => this.openNewRoute(`/${this.type}`));

        await this.loadCategory();
    }

    async loadCategory() {
        const response = await CategoryService.getCategory(this.type, this.categoryId);
        if (response.error) {
            return;
        }

        if (!this.titleInput) {
            return;
        }

        this.titleInput.value = response.category.title;
    }

    async updateCategory(e) {
        e.preventDefault();

        if (!this.titleInput || !this.titleInput.value.trim()) {
            return;
        }

        const response = await CategoryService.updateCategory(this.type, this.categoryId, { title: this.titleInput.value.trim() });

        if (response.error) {
            return;
        }

        this.openNewRoute(`/${this.type}`);
    }
}