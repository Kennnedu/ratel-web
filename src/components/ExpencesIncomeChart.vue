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
import { mapGetters } from 'vuex'
import { prepareExpencesIncomeDatasets } from '../utils/chartsData'
import { initExpencesIncomeChart } from '../utils/charts'

export default {
  data: function() {
    return {
      periodStep: 'month'
    }
  },

  computed: {
    ...mapGetters(['filterRecordParams']),
  },

  mounted() {
    this.fetchExpencesIncomeData();
  },

  watch: {
    periodStep() {
      if(this.expencesIncomeChart) this.expencesIncomeChart.destroy();
      return this.fetchExpencesIncomeData();
    },

    filterRecordParams: {
      handler: function(){
        if(this.expencesIncomeChart) this.expencesIncomeChart.destroy();
        this.fetchExpencesIncomeData()
      },
      deep: true
    },
  },

  methods: {
    async fetchExpencesIncomeData() {
      let expencesData = [], incomeData = [], datasets = [];

      await axios.get('/records/statistic/sum', { 
        params: Object.assign({'type': 'expences', 'period_step': this.periodStep}, this.filterRecordParams) 
      }).then(({ data }) => expencesData = data.statistic)

      await axios.get('/records/statistic/sum', {
        params: Object.assign({'type': 'replenish', 'period_step': this.periodStep}, this.filterRecordParams)
      }).then(({ data }) => incomeData = data.statistic)

      datasets = prepareExpencesIncomeDatasets(incomeData, expencesData)

      this.expencesIncomeChart = initExpencesIncomeChart(document.getElementById('expences-chart'), datasets[0], datasets[1], this.periodStep)
    }
  }
}
</script>