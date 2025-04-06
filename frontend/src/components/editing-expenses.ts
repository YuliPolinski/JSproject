import {UrlUtils} from "../utils/url-utils";
import {CategoryService} from "../services/category-service";
import {CategoryResponse} from "../types/category.type";

export class EditExpenses {

    public openNewRoute: (url: string) => Promise<void>;
    readonly categoryId: number;
    readonly type: string;
    readonly saveButton: HTMLButtonElement;
    readonly cancelButton: HTMLButtonElement;
    readonly titleInput: HTMLInputElement;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.categoryId = parseInt(UrlUtils.getUrlParam("id")!, 10);
        this.type = window.location.pathname.includes("expenses") ? "expense" : "income";

        this.saveButton = document.getElementById("editingExpenses") as HTMLButtonElement;
        this.cancelButton = document.getElementById("cancelExpenses") as HTMLButtonElement;
        this.titleInput = document.getElementById("newTitleExpense") as HTMLInputElement;

        if (!this.categoryId) {
            this.openNewRoute(`/${this.type}s`).then();
            return;
        }

        this.init().then();
    }

    public async init(): Promise<void> {

        if (!this.saveButton || !this.cancelButton || !this.titleInput) {
            return;
        }

        this.saveButton.addEventListener("click", this.updateCategory.bind(this));
        this.cancelButton.addEventListener("click", () => this.openNewRoute(`/${this.type}s`));

        await this.loadCategory();
    }

    private async loadCategory(): Promise<void> {
        const response: CategoryResponse = await CategoryService.getCategory(this.type, this.categoryId);

        if (response.error || !response.response || !this.titleInput) {
            return;
        }

        this.titleInput.value = response.response.title;
    }

    private async updateCategory(e: Event): Promise<void> {
        e.preventDefault();

        if (!this.titleInput || !this.titleInput.value.trim()) {
            return;
        }

        const response: CategoryResponse = await CategoryService.updateCategory(this.type, this.categoryId, {title: this.titleInput.value.trim()});

        if (response.error) {
            alert(response.error);
            return;
        }

        this.openNewRoute(`/${this.type}s`).then();
    }
}