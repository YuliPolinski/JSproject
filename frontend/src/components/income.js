import { CategoryService } from "../services/category-service";

export class Income {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.loadCategories();
    }

    async loadCategories() {
        const response = await CategoryService.getCategories("income");
        if (response.error) {
            console.error(response.error);
            return;
        }
        this.renderCategories(response.categories);
    }

    renderCategories(categories) {
        const container = document.getElementById("incomeCategoryBox");
        if (!container) {
            return;
        }

        container.innerHTML = "";

        categories.forEach(category => {
            const categoryElement = document.createElement("div");
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


        const addCategoryElement = document.createElement("div");
        addCategoryElement.className = "col-md-4";
        addCategoryElement.innerHTML = `
            <div class="card p-3 shadow-sm d-flex justify-content-center align-items-center">
                <a href="/create-income" class="btn btn-lg">+</a>
            </div>
        `;
        container.appendChild(addCategoryElement);

        this.initEventListeners();
    }

    initEventListeners() {
        document.querySelectorAll(".btn-edit").forEach(button => {
            button.addEventListener("click", (event) => {
                const categoryId = event.target.getAttribute("data-id");
                this.openNewRoute(`/editing-income?id=${categoryId}`);
            });
        });

        document.querySelectorAll(".btn-delete").forEach(button => {
            button.addEventListener("click", (event) => this.showDeleteDialog(event));
        });
    }

    showDeleteDialog(event) {
        const dialog = document.getElementById("dialog");
        const confirmDelete = document.getElementById("confirmDelete");
        const cancelDelete = document.getElementById("cancelDelete");
        const categoryId = event.target.getAttribute("data-id");

        if (!dialog || !confirmDelete || !cancelDelete) {
            return;
        }

        dialog.style.display = "flex";

        cancelDelete.onclick = () => (dialog.style.display = "none");

        confirmDelete.onclick = async () => {
            await this.deleteCategory(categoryId);
            dialog.style.display = "none";
        };
    }

    async deleteCategory(id) {
        const response = await CategoryService.deleteCategory("income", id);

        if (!response.error) {
            document.querySelector(`[data-id="${id}"]`).closest(".col-md-4").remove();
        } else {
            console.error(response.error);
        }
    }
}