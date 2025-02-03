export class IncomeExpenses {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        this.dialog = document.getElementById('dialog');
        this.deleteLink = document.querySelectorAll('.delete-link');
        this.confirmDeleteButton = document.getElementById('confirmDelete');
        this.cancelDeleteButton = document.getElementById('cancelDelete');

        this.createIncomeButton = document.getElementById('createIncome');
        this.createExpensesButton = document.getElementById('createExpenses');

        if (this.dialog && this.cancelDeleteButton && this.confirmDeleteButton) {
            this.linkOfDelete();
        } else {
            console.error("Диалог или кнопки удаления не найдены");
        }

        if (this.createIncomeButton && this.createExpensesButton) {
            this.addButtonListeners();
        } else {
            console.error("Кнопки создания не найдены!");
        }
    }

    linkOfDelete() {
        this.deleteLink.forEach(link => {
            link.addEventListener('click', () => {
                if (this.dialog) {
                    this.dialog.style.display = 'flex';
                } else {
                    console.error("Элемент (#dialog) не найден!");
                }
            });
        });

        this.cancelDeleteButton.addEventListener('click', () => {
            if (this.dialog) {
                this.dialog.style.display = 'none';
            }
        });

        this.confirmDeleteButton.addEventListener('click', () => {
            if (this.dialog) {
                this.dialog.style.display = 'none';
            }
        });
    }

    addButtonListeners() {
        this.createIncomeButton.addEventListener('click', () => {
            this.openNewRoute('/create-income');
        });

        this.createExpensesButton.addEventListener('click', () => {
            this.openNewRoute('/create-expenses');
        });
    }
}