import {Chart, PieController, ArcElement, Tooltip, Legend} from 'chart.js';

Chart.register(ArcElement, PieController, Tooltip, Legend);
import {OperationService} from "../services/operation-service";


export class Main {
    constructor() {
        if (window.__MainInstance) {
            return window.__MainInstance;
        }
        window.__MainInstance = this;


        this.currentPeriod = "all";
        this.startDate = null;
        this.endDate = null;

        this.incomeChart = null;
        this.expenseChart = null;
        this.isUpdating = false;

        this.initFilters();
        this.updateCharts();
    }

    async fetchOperations(period = this.currentPeriod, startDate = this.startDate, endDate = this.endDate) {

        let response;
        if (period === "interval" && startDate && endDate) {
            response = await OperationService.getOperations("interval", startDate, endDate);
        } else {
            response = await OperationService.getOperations(period);
        }

        return response.response || [];
    }

    async updateCharts(period = this.currentPeriod, startDate = this.startDate, endDate = this.endDate) {
        if (this.isUpdating) {
            return;
        }
        this.isUpdating = true;

        this.currentPeriod = period;
        this.startDate = startDate;
        this.endDate = endDate;

        const operations = await this.fetchOperations(period, startDate, endDate);
        this.renderCharts(operations);

        this.isUpdating = false;
    }

    renderCharts(operations) {

        const incomeData = this.aggregateData(operations, "income");
        const expenseData = this.aggregateData(operations, "expense");

        this.updateChart("myChart", incomeData, "incomeChart");
        this.updateChart("myChart2", expenseData, "expenseChart");
    }

    aggregateData(operations, type) {

        if (!Array.isArray(operations)) {
            return {
                labels: ["Нет данных"],
                datasets: [{data: [1], backgroundColor: ["#CCCCCC"]}]
            };
        }

        const categoryTotals = {};
        const categoryColors = {};
        const colors = ["#dc3545", "#45add1", "#ffc107", "#28a745", "#007bff", "#6610f2"];

        let colorIndex = 0;

        operations
            .filter((op) => op.type === type)
            .forEach((op) => {
                if (!categoryTotals[op.comment]) {
                    categoryTotals[op.comment] = 0;
                    categoryColors[op.comment] = colors[colorIndex % colors.length];
                    colorIndex++;
                }
                categoryTotals[op.comment] += op.amount;
            });

        if (Object.keys(categoryTotals).length === 0) {
            return {
                labels: ["Нет данных"],
                datasets: [{data: [1], backgroundColor: ["#CCCCCC"]}]
            };
        }

        return {
            labels: Object.keys(categoryTotals),
            datasets: [
                {
                    data: Object.values(categoryTotals),
                    backgroundColor: Object.values(categoryColors)
                }
            ],
            legendColors: categoryColors
        };
    }

    updateChart(chartId, chartData, chartVariableName) {
        const canvas = document.getElementById(chartId);
        if (!canvas) {
            return;
        }


        if (this[chartVariableName] instanceof Chart) {
            this[chartVariableName].destroy();
        }

        console.log(`✅ Создаём новый график: ${chartId}`);

        this[chartVariableName] = new Chart(canvas, {
            type: "pie",
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {display: false}
                }
            }
        });

        this.renderLegend(chartId === "myChart" ? "legend1" : "legend2", chartData.legendColors);
    }

    renderLegend(legendId, legendColors) {
        const legendContainer = document.getElementById(legendId);
        if (!legendContainer) return;

        if (!legendColors || Object.keys(legendColors).length === 0) {
            legendContainer.innerHTML = '<span class="chart-legend-empty">Нет данных</span>';
            return;
        }

        legendContainer.innerHTML = "";

        Object.entries(legendColors).forEach(([label, color]) => {
            const legendItem = document.createElement("div");
            legendItem.classList.add("chart-legend-item");

            const colorBox = document.createElement("span");
            colorBox.style.display = "inline-block";
            colorBox.style.width = "35px";
            colorBox.style.height = "10px";
            colorBox.style.backgroundColor = color;
            colorBox.style.marginRight = "10px";

            const labelText = document.createElement("span");
            labelText.textContent = label;

            legendItem.appendChild(colorBox);
            legendItem.appendChild(labelText);
            legendContainer.appendChild(legendItem);
        });
    }

    initFilters() {

        const filterButtons = document.querySelectorAll(".btn-box button");
        const dateRangeBox = document.querySelector(".date-box");

        if (!filterButtons.length) {
            return;
        }

        filterButtons.forEach((button) => {
            button.addEventListener("click", async () => {
                filterButtons.forEach((btn) => btn.classList.remove("active", "btn-secondary"));
                button.classList.add("active", "btn-secondary");

                const period = button.getAttribute("data-period");

                if (!period) {
                    return;
                }

                if (period === "interval") {
                    dateRangeBox.style.display = "flex";
                } else {
                    dateRangeBox.style.display = "none";
                    await this.updateCharts(period);
                }
            });
        });

        this.initDatePickers(dateRangeBox);
    }

    initDatePickers(dateRangeBox) {
        if (!dateRangeBox) return;
        const dateLinks = dateRangeBox.querySelectorAll("a");

        dateLinks.forEach((datePicker, index) => {
            datePicker.addEventListener("click", () => {
                const input = document.createElement("input");
                input.type = "date";
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
                            this.startDate = selectedDate;
                        } else {
                            this.endDate = selectedDate;
                        }

                        if (this.startDate && this.endDate) {
                            await this.updateCharts("interval", this.startDate, this.endDate);
                        }
                    }
                    input.remove();
                });

                input.addEventListener("blur", () => {
                    setTimeout(() => input.remove(), 200);
                });
            });
        });
    }
}




