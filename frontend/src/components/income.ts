import {CategoryService} from "../services/category-service";
import {HttpResponseType} from "../types/http-response.type";
import {CategoryType} from "../types/category.type";

export class Income {

    public openNewRoute: (url: string) => Promise<void>;

    constructor(openNewRoute: (url: string) => Promise<void>) {
        this.openNewRoute = openNewRoute;
        this.loadCategories().then();
    }

    private async loadCategories(): Promise<void> {
        const response: HttpResponseType<CategoryType[]> = await CategoryService.getCategories("income");
        if (response.error || !response.response) {
            console.error(response.error);
            return;
        }
        this.renderCategories(response.response);
    }

    private renderCategories(categories: CategoryType[]): void {
        const container: HTMLElement | null = document.getElementById("incomeCategoryBox");
        if (!container) {
            return;
        }

        container.innerHTML = "";

        categories.forEach((category: CategoryType) => {
            const categoryElement: HTMLDivElement = document.createElement("div");
            categoryElement.className = "col-md-4";
            categoryElement.innerHTML = `
                <div class="card p-3 shadow-sm">
                    <h5>${category.title}</h5>
                    <div class="d-flex mt-3 gap-1">
                        <a href="javascript:void(0)" class="btn-edit btn btn-primary btn-sm" data-id="${category.id}">Редактировать</a>
                        <button class="btn-delete btn btn-danger btn-sm" data-id="${category.id}">Удалить</button>
                    </div>
                </div>
            `;
            container.appendChild(categoryElement);
        });


        const addCategoryElement: HTMLDivElement = document.createElement("div");
        addCategoryElement.className = "col-md-4";
        addCategoryElement.innerHTML = `
            <div class="card p-3 shadow-sm d-flex justify-content-center align-items-center">
                <a href="/create-income" class="btn btn-lg">+</a>
            </div>
        `;
        container.appendChild(addCategoryElement);

        this.initEventListeners();
    }

    private initEventListeners(): void {
        document.querySelectorAll(".btn-edit").forEach((button) => {
            button.addEventListener("click", (event: Event) => {
                const target = event.target as HTMLElement;
                const categoryId: number = parseInt(target.getAttribute("data-id")!, 10);

                if (categoryId) {
                    this.openNewRoute(`/editing-income?id=${categoryId}`).then();
                }
            });
        });

        document.querySelectorAll(".btn-delete").forEach((button) => {
            button.addEventListener("click", (event: Event) => this.showDeleteDialog(event));
        });
    }

    private showDeleteDialog(event: Event): void {
        const dialog = document.getElementById("dialog") as HTMLElement;
        const confirmDelete = document.getElementById("confirmDelete") as HTMLElement;
        const cancelDelete = document.getElementById("cancelDelete") as HTMLElement;
        const target = event.target as HTMLElement;
        const categoryId: number = parseInt(target.getAttribute("data-id")!, 10);

        if (!dialog || !confirmDelete || !cancelDelete || !categoryId) {
            return;
        }

        dialog.style.display = "flex";

        cancelDelete.onclick = () => (dialog.style.display = "none");

        confirmDelete.onclick = async () => {
            await this.deleteCategory(categoryId);
            dialog.style.display = "none";
        };
    }

    private async deleteCategory(id: number): Promise<void> {
        const response: HttpResponseType<null> = await CategoryService.deleteCategory("income", id);

        if (!response.error) {
            const cardElement = document.querySelector(`[data-id="${id}"]`)?.closest(".col-md-4");
            if (cardElement) {
                cardElement.remove();
            }
        } else {
            console.error(response.error);
        }
    }
}