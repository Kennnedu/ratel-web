<template>
  <b-card no-body>
    <b-card-header class="d-flex justify-content-between flex-wrap">
      <h4>Expences/Income</h4>
      <b-form-group>
        <b-form-radio-group
          :options="['day', 'week', 'month', 'quarter', 'year']"
          buttons
          button-variant="outline-secondary"
          size="sm"
          :checked="periodStep"
          @input="val => this.periodStep = val"
        >
      </b-form-radio-group>
      </b-form-group>
    </b-card-header>
    <b-card-body>
      <canvas id="expences-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
    </b-card-body>
  </b-card>
</template>
<script>
import axios from 'axios';
import { prepareExpencesIncomeDatasets } from '../utils/chartsData'
import { initExpencesIncomeChart } from '../utils/charts'

export default {
  data: function() {
    return {
      periodStep: 'month'
    }
  },

  mounted() {
    this.fetchExpencesData();
  },

  watch: {
    periodStep() {
      if(this.expencesChart) this.expencesChart.destroy();
      return this.fetchExpencesData();
    }
  },

  methods: {
    async fetchExpencesData() {
      let expencesData = [], incomeData = [], datasets = [];

      await axios.get(`/records/statistic/sum?type=expences&period_step=${this.periodStep}`).then(({ data }) => expencesData = data.statistic)
      await axios.get(`/records/statistic/sum?type=replenish&period_step=${this.periodStep}`).then(({ data }) => incomeData = data.statistic)

      datasets = prepareExpencesIncomeDatasets(incomeData, expencesData)

      this.expencesChart = initExpencesIncomeChart(document.getElementById('expences-chart'), datasets[0], datasets[1], this.periodStep)
    }
  }
}
</script>