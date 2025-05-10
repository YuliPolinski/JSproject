import {IncomeExpenses} from "../components/income-expenses";

export class CommonUtils {

    static deleteClick(){
        const dialog = document.getElementById('dialog');
        const deleteButtons = document.querySelectorAll('.btn-delete');
        const confirmDeleteButton = document.getElementById('confirmDelete');
        const cancelDeleteButton = document.getElementById('cancelDelete');


        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                dialog.style.display = 'flex';
            });
        });

        cancelDeleteButton.addEventListener('click', () => {
            dialog.style.display = 'none';
        });

        confirmDeleteButton.addEventListener('click', () => {
            dialog.style.display = 'none';
        });
    }
}