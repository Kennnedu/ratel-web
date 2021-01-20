<template>
  <b-card no-body>
    <b-card-header class="d-flex justify-content-between flex-wrap">
      <h4>Balance</h4>
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
      <canvas id="balance-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
    </b-card-body>
  </b-card>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { prepareBalanceDatasets } from '../utils/chartsData'
import { initBalanceChart } from '../utils/charts'

export default {
  data: function() {
    return {
      periodStep: 'month'
    }
  },

  watch: {
    periodStep() {
      if(this.balanceChart) this.balanceChart.destroy();
      return this.fetchBalancesData();
    },

    filterRecordParams: {
      handler: function(){
        if(this.balanceChart) this.balanceChart.destroy();
        this.fetchBalancesData()
      },
      deep: true
    },
  },

  mounted() {
    this.fetchBalancesData()
  },

  computed: {
    ...mapGetters(['filterParams', 'filterRecordParams']),
  },

  methods: {
    async fetchBalancesData() {
      let balancesData = [], datasets = [];
      let statisticParams = Object.assign({ 'period_step': this.periodStep }, this.filterRecordParams)

      await axios.get('/records/statistic/sum', { params: statisticParams }).then(({ data }) => balancesData = data.statistic)

      if(Date.parse(this.filterParams['performed_at[gt]'])) {
        let sinceDate = moment(Date.parse(this.filterParams['performed_at[gt]'])).subtract(1, 'day').utc().format('llll');

        await axios.get('/records/sum', {
          params: Object.assign({}, this.filterParams, { 'performed_at[lt]': sinceDate, 'performed_at[gt]': null })
        }).then( data => { this.startBalance = data.data.sum })
      } else {
        this.startBalance = 0
      }

      datasets = prepareBalanceDatasets(balancesData, this.startBalance)
      this.balanceChart = initBalanceChart(document.getElementById('balance-chart'), datasets, this.periodStep)
    }
  }
} 
</script>