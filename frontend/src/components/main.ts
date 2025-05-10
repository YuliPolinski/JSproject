import {Chart, PieController, ArcElement, Tooltip, Legend} from 'chart.js';

Chart.register(ArcElement, PieController, Tooltip, Legend);
import {OperationService} from "../services/operation-service";
import {HttpResponseType} from "../types/http-response.type";
import {OperationsType} from "../types/operations.type";
import {ChartDataType} from "../types/chart-data.type";

declare global {
    interface Window {
        __MainInstance?: Main | null;
    }
}

export class Main {

    private currentPeriod!: string;
    private startDate!: string | null;
    private endDate!: string | null;
    private incomeChart!: Chart | null;
    private expenseChart!: Chart | null;
    private isUpdating!: boolean;

    constructor() {

        if (window.__MainInstance) {
            return;
        }
        window.__MainInstance = this;


        this.currentPeriod = "all";
        this.startDate = null;
        this.endDate = null;

        this.incomeChart = null;
        this.expenseChart = null;
        this.isUpdating = false;

        this.initFilters();
        this.updateCharts().then();
    }

    private async fetchOperations(period: string = this.currentPeriod, startDate: string | null = this.startDate, endDate: string | null = this.endDate): Promise<OperationsType[]> {

        let response: HttpResponseType<OperationsType[]>;
        if (period === "interval" && startDate && endDate) {
            response = await OperationService.getOperations("interval", startDate, endDate);
        } else {
            response = await OperationService.getOperations(period);
        }

        return response.response || [];
    }

    private async updateCharts(period: string = this.currentPeriod, startDate: string | null = this.startDate, endDate: string | null = this.endDate): Promise<void> {
        if (this.isUpdating) {
            return;
        }
        this.isUpdating = true;

        this.currentPeriod = period;
        this.startDate = startDate;
        this.endDate = endDate;

        const operations: OperationsType[] = await this.fetchOperations(period, startDate, endDate);
        this.renderCharts(operations);

        this.isUpdating = false;
    }

    renderCharts(operations: OperationsType[]) {

        const incomeData: ChartDataType = this.aggregateData(operations, "income");
        const expenseData: ChartDataType = this.aggregateData(operations, "expense");

        this.updateChart("myChart", incomeData, "incomeChart");
        this.updateChart("myChart2", expenseData, "expenseChart");

    }

    private aggregateData(operations: OperationsType[], type: 'income' | 'expense'): ChartDataType {

        if (!Array.isArray(operations)) {
            return {
                labels: ["Нет данных"],
                datasets: [{data: [1], backgroundColor: ["#CCCCCC"]}]
            };
        }

        const categoryTotals: Record<string, number> = {};
        const categoryColors: Record<string, string> = {};
        const colors: string[] = ["#dc3545", "#45add1", "#ffc107", "#28a745", "#007bff", "#6610f2"];

        let colorIndex: number = 0;

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

    private updateChart(chartId: string, chartData: ChartDataType, chartVariableName: "incomeChart" | "expenseChart"): void {
        const canvas = document.getElementById(chartId) as HTMLCanvasElement | null;
        if (!canvas) return;

        // Удаляем предыдущий график, если он есть
        const existingChart = this[chartVariableName] as Chart | null;
        if (existingChart) {
            existingChart.destroy();
        }

        console.log(`Создаем новый график: ${chartId}`);

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

    private renderLegend(legendId: string, legendColors: Record<string, string> | undefined): void {
        const legendContainer: HTMLElement | null = document.getElementById(legendId);
        if (!legendContainer) return;

        if (!legendColors || Object.keys(legendColors).length === 0) {
            legendContainer.innerHTML = '<span class="chart-legend-empty">Нет данных</span>';
            return;
        }

        legendContainer.innerHTML = "";

        Object.entries(legendColors).forEach(([label, color]) => {
            const legendItem: HTMLDivElement = document.createElement("div");
            legendItem.classList.add("chart-legend-item");

            const colorBox: HTMLSpanElement = document.createElement("span");
            colorBox.style.display = "inline-block";
            colorBox.style.width = "35px";
            colorBox.style.height = "10px";
            colorBox.style.backgroundColor = color;
            colorBox.style.marginRight = "10px";

            const labelText: HTMLSpanElement = document.createElement("span");
            labelText.textContent = label;

            legendItem.appendChild(colorBox);
            legendItem.appendChild(labelText);
            legendContainer.appendChild(legendItem);
        });
    }

    private initFilters(): void {

        const filterButtons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".btn-box button");
        const dateRangeBox: HTMLElement | null = document.querySelector(".date-box");

        if (!filterButtons.length) {
            return;
        }

        filterButtons.forEach((button: HTMLButtonElement) => {
            button.addEventListener("click", async () => {
                filterButtons.forEach((btn: HTMLButtonElement) => btn.classList.remove("active", "btn-secondary"));
                button.classList.add("active", "btn-secondary");

                const period: string | null = button.getAttribute("data-period");

                if (!period) {
                    return;
                }

                if (period === "interval") {
                    if (dateRangeBox) {
                        dateRangeBox.style.display = "flex";
                    }
                } else {
                    if (dateRangeBox) {
                        dateRangeBox.style.display = "none";
                    }
                    await this.updateCharts(period);
                }
            });
        });
        if (dateRangeBox) {
            this.initDatePickers(dateRangeBox);
        }
    }

    private initDatePickers(dateRangeBox: HTMLElement): void {
        if (!dateRangeBox) return;
        const dateLinks = dateRangeBox.querySelectorAll("a");

        dateLinks.forEach((datePicker: HTMLAnchorElement, index: number) => {
            datePicker.addEventListener("click", () => {
                const input: HTMLInputElement = document.createElement("input");
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
                    const selectedDate: string = input.value;
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




