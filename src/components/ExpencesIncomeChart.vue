<template>
  <b-card no-body>
    <b-card-header class="d-flex justify-content-between flex-wrap">
      <h4>Expences/Income</h4>
      <font-awesome-icon icon="ellipsis-h" style="font-size: 16px;" v-b-toggle.collapse-expences-income-chart />
    </b-card-header>
    <b-collapse id="collapse-expences-income-chart">
      <b-card-body>
        <b-form-group class="float-right">
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
        <canvas id="expences-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
      </b-card-body>
    </b-collapse>
    <b-card-body>
      <b-row no-gutters class="text-center">
        <b-col md="6">Total Expences: {{totalExpences}}</b-col>
        <b-col md="6">Total Income: {{totalIncome}}</b-col>
      </b-row>
    </b-card-body>
  </b-card>
</template>
<script>
import axios from 'axios';
import { mapGetters } from 'vuex'
import { prepareExpencesIncomeDatasets } from '../utils/chartsData'
import { initExpencesIncomeChart } from '../utils/charts'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons'

library.add(faEllipsisH)

export default {
  data: function() {
    return {
      periodStep: 'month',
      totalExpences: 0,
      totalIncome: 0
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

      this.totalIncome = datasets[0].map(el => el['y']).reduce((calc, val) => Number((calc + Number(val)).toFixed(2)), 0);
      this.totalExpences = datasets[1].map(el => el['y']).reduce((calc, val) => Number((calc + Number(val)).toFixed(2)), 0);

      this.expencesIncomeChart = initExpencesIncomeChart(document.getElementById('expences-chart'), datasets[0], datasets[1], this.periodStep)
    }
  }
}
</script>