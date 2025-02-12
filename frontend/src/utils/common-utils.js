import {AuthUtils} from "./auth-utils";
import {HttpUtils} from "./http-utils";

export class CommonUtils {

    static initPeriodFilter(loadOperationsCallback) {
        const filterButtons = document.querySelectorAll(".btn-box button");
        const dateRangeBox = document.querySelector(".date-box");

        if (!filterButtons.length || !dateRangeBox) {
            console.error("❌ Ошибка: Не найдены кнопки фильтрации или контейнер диапазона дат.");
            return;
        }

        let selectedStartDate = null;
        let selectedEndDate = null;

        // Обработчик для кнопок фильтрации
        filterButtons.forEach(button => {
            button.addEventListener("click", async () => {
                filterButtons.forEach(btn => btn.classList.remove("active", "btn-secondary"));
                button.classList.add("active", "btn-secondary");

                const period = button.getAttribute("data-period");

                if (period === "interval") {
                    dateRangeBox.style.display = "flex";
                } else {
                    dateRangeBox.style.display = "none";
                    await loadOperationsCallback(period);
                }
            });
        });

        // Обработчик для выбора дат
        dateRangeBox.querySelectorAll("a").forEach((datePicker, index) => {
            datePicker.addEventListener("click", () => {
                const oldInput = document.getElementById("date-picker");
                if (oldInput) oldInput.remove();

                const input = document.createElement("input");
                input.type = "date";
                input.id = "date-picker";
                input.style.position = "absolute";
                input.style.left = datePicker.getBoundingClientRect().left + "px";
                input.style.top = datePicker.getBoundingClientRect().bottom + "px";
                input.style.zIndex = "1000";
                input.style.border = "1px solid #ccc";
                input.style.padding = "5px";
                input.style.fontSize = "16px";
                input.style.width = "150px";

                document.body.appendChild(input);
                input.focus();

                input.addEventListener("change", async () => {
                    const selectedDate = input.value;

                    if (selectedDate) {
                        datePicker.textContent = selectedDate.split("-").reverse().join(".");

                        if (index === 0) {
                            selectedStartDate = selectedDate;
                        } else {
                            selectedEndDate = selectedDate;
                        }

                        if (selectedStartDate && selectedEndDate) {
                            await loadOperationsCallback("interval", selectedStartDate, selectedEndDate);
                        }
                    }
                    if (input.parentNode) {
                        input.remove();
                    }
                });

                input.addEventListener("blur", () => {
                    setTimeout(() => {
                        if (input.parentNode) {
                            input.remove();
                        }
                    }, 200);
                });
            });
        });
    }


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

    static updateProfileName() {
        setTimeout(() => {
            const profileNameElement = document.getElementById('profile-name');
            let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);

            if (profileNameElement && userInfo) {
                userInfo = JSON.parse(userInfo);
                profileNameElement.innerText = userInfo.name + " " + userInfo.lastName;
            }
        }, 300);
    }

    static async getBalance() {
        try {
            let response = await HttpUtils.request('/balance', 'GET', true);

            if (!response || response.error || !response.response) {
                return 0;
            }

            let balanceElement = document.getElementById('balance');
            let balance = response.response.balance ?? 0;
            balanceElement.innerText = balance + " $";

            return balance;
        } catch (error) {
            return 0;
        }
    }
}

