import { Chart, PieController, ArcElement, Tooltip, Legend} from 'chart.js';
Chart.register(ArcElement, PieController, Tooltip, Legend);
import color from '@kurkle/color';

export class Main {
    constructor() {

        this.initializeCharts();
        console.log(color('red').rgbString());
    }

    initializeCharts() {
        // const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#007bff'];
        const colors = ['rgba(220, 53, 69, 1.0)', 'rgba(253, 126, 20, 1.0)', 'rgba(255, 193, 7, 1.0)', 'rgba(40, 167, 69, 1.0)', 'rgba(0, 123, 255, 1.0)'];
        const labels = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];

        // Данные для диаграмм
        const chartData = [
            { id: 'myChart', legendId: 'legend1', data: [30, 40, 20, 10, 15] },
            { id: 'myChart2', legendId: 'legend2', data: [5, 15, 35, 40, 30] }
        ];

        chartData.forEach(chart => {
            const data = {
                labels: labels,
                datasets: [{
                    data: chart.data,
                    backgroundColor: colors,
                }]
            };

            this.renderChart(chart.id, data);
            this.renderLegend(chart.legendId, data);
        });
    }

    renderChart(chartId, data) {
        const canvas = document.getElementById(chartId);
        if (!canvas) {
            console.error("Элемент <canvas> с id " + chartId + " не найден");
            return;
        }

        try {
            new Chart(canvas, {
                type: 'pie',
                data: data,
                options: {
                    plugins: {
                        legend: {
                            display: false,
                        }
                    }
                }
            });
        } catch (error) {
            console.error("Ошибка при создании диаграммы для " + chartId + error);
        }
    }

// Метод рендеринга легенды
    renderLegend(legendId, data) {
        const legendContainer = document.getElementById(legendId);
        if (!legendContainer) {
            console.error("Элемент с id " + legendId + " не найден");
            return;
        }

        legendContainer.innerHTML = ''; // Очищаем перед добавлением новых элементов
        data.labels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.classList.add('chart-legend-item');

            const colorBox = document.createElement('span');
            colorBox.style.display = 'inline-block';
            colorBox.style.width = '35px';
            colorBox.style.height = '10px';
            colorBox.style.backgroundColor = data.datasets[0].backgroundColor[index];
            colorBox.style.marginRight = '10px';

            const labelText = document.createElement('span');
            labelText.textContent = label;

            legendItem.appendChild(colorBox);
            legendItem.appendChild(labelText);
            legendContainer.appendChild(legendItem);
        });
    }

}