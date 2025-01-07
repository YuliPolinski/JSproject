const colors = ['#dc3545', '#fd7e14', '#ffc107', '#28a745', '#007bff'];
const labels = ['Red', 'Orange', 'Yellow', 'Green', 'Blue'];

// Данные для первой диаграммы
const data1 = {
    labels: labels,
    datasets: [{
        data: [30, 40, 20, 10, 15],
        backgroundColor: colors,
    }]
};

// Данные для второй диаграммы
const data2 = {
    labels: labels,
    datasets: [{
        data: [5, 15, 35, 40, 30],
        backgroundColor: colors,
    }]
};

// Настройки диаграммы
const config = (data) => ({
    type: 'pie',
    data: data,
    options: {
        plugins: {
            legend: {
                display: false, // Отключаем встроенную легенду
            }
        }
    }
});

// Создание диаграмм
const chart1 = new Chart(
    document.getElementById('myChart'),
    config(data1)
);

const chart2 = new Chart(
    document.getElementById('myChart2'),
    config(data2)
);

// Функция для создания легенды
const createLegend = (legendId, data) => {
    const legendContainer = document.getElementById(legendId);
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
};

// Создание легенд для обеих диаграмм
createLegend('legend1', data1);
createLegend('legend2', data2);