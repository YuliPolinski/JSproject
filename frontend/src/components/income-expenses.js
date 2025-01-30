export class IncomeExpenses {
    constructor(openNewRoute) {

        this.openNewRoute = openNewRoute;

        this.dialog = document.getElementById('dialog');
        this.deleteLink = document.querySelectorAll('.delete-link');
        this.confirmDeleteButton = document.getElementById('confirmDelete');
        this.cancelDeleteButton = document.getElementById('cancelDelete');

        this.createIncomeButton = document.getElementById('createIncome');
        this.createExpensesButton = document.getElementById('createExpenses');

        this.linkOfDelete();
        this.addButtonListeners();
    }

    linkOfDelete() {
        this.deleteLink.forEach(button => {
            button.addEventListener('click', () => {
                this.dialog.style.display = 'flex';
            });
        });

        this.cancelDeleteButton.addEventListener('click', () => {
            this.dialog.style.display = 'none';
        });

        this.confirmDeleteButton.addEventListener('click', () => {
            this.dialog.style.display = 'none';
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