import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.defaults.global.defaultFontFamily = "'Nunito', sans-serif"
Chart.defaults.global.defaultFontSize = 11
Chart.plugins.unregister(ChartDataLabels);

export const initExpencesIncomeChart = (node, incomeData, expencesData, dateStep) => {
  return new Chart(node, {
    type: 'bar',
    data: {
      datasets: [{
        label: 'Expences',
        data: expencesData,
        borderColor: "#d5505d",
        backgroundColor: "#fa9ea6",
        borderWidth: 2
      }, {
        label: 'Income',
        data: incomeData,
        borderColor: "#58d775",
        backgroundColor: "#cdf0d5",
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        xAxes: [{
          offset: true,
          type: 'time',
          distribution: 'series',
          time: {
            tooltipFormat:'MM/DD/YYYY',
            unit: dateStep
          }
        }]
      }
    }
  })
}

export const initCardsChart = (node, data) => {
  return  new Chart(node, {
    plugins: [ChartDataLabels],
    type: 'doughnut',
    data: {
      labels: data['labels'],
      datasets: [{
        data: data['dataset'],
        datalabels: {
          formatter: value => `${data['dataLabels'][data['dataset'].indexOf(value)]} %`,
          color: 'white',
          display: 'auto'
        }, 
        backgroundColor: data['colors'],
        hoverBorderWidth: 5
      }]
    },
    options: {
      circumference: Math.PI,
      rotation: -Math.PI
    }
  })
}

export const initTagsChart = (node, data) => {
  return  new Chart(node, {
    plugins: [ChartDataLabels],
    type: 'pie',
    data: {
      labels: data['labels'],
      datasets: [{
        data: data['dataset'],
        dataLabels: data['labels'],
        datalabels: {
          formatter: value => `${data['dataLabels'][data['dataset'].indexOf(value)]} %`,
          color: 'white',
          display: 'auto'
        },
        backgroundColor: data['colors'],
        hoverBorderWidth: 5
      }]
    }
  })
}