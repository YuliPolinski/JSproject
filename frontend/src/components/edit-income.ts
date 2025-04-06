import {CategoryService} from "../services/category-service";
import {UrlUtils} from "../utils/url-utils";
import {CategoryResponse} from "../types/category.type";


export class EditIncome {

    public openNewRoute: (url: string) => Promise<void>;
    readonly categoryId: number;
    readonly type: string;
    readonly saveButton: HTMLButtonElement;
    readonly cancelButton: HTMLButtonElement;
    readonly titleInput: HTMLInputElement;

    constructor(openNewRoute: (url: string) => Promise<void>) {

        this.openNewRoute = openNewRoute;

        this.saveButton = document.getElementById("saveEditingIncome") as HTMLButtonElement;
        this.cancelButton = document.getElementById("cancelEditIncome") as HTMLButtonElement;
        ;
        this.titleInput = document.getElementById("newTitleIncome") as HTMLInputElement;

        this.categoryId = parseInt(UrlUtils.getUrlParam("id")!, 10);

        this.type = window.location.pathname.includes("income") ? "income" : "expense";

        if (!this.categoryId) {
            this.openNewRoute(`/${this.type}`).then();
            return;
        }

        this.init().then();
    }

    public async init(): Promise<void> {

        if (!this.saveButton || !this.cancelButton || !this.titleInput) {
            return;
        }

        this.saveButton.addEventListener("click", this.updateCategory.bind(this));
        this.cancelButton.addEventListener("click", () => this.openNewRoute(`/${this.type}`));

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
            return;
        }

        this.openNewRoute(`/${this.type}`).then();
    }
}