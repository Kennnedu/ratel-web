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
      if(this.balancesChart) this.balancesChart.destroy();
      return this.fetchBalancesData();
    }
  },

  mounted() {
    this.fetchBalancesData()
  },

  computed: {
    ...mapGetters(['filterParams']),
  },

  methods: {
    async fetchBalancesData() {
      let balancesData = [], datasets = [];
      let filter = Object.assign({}, this.filterParams, { 'performed_at[lt]': this.filterParams['performed_at[gt]'] });

      await axios.get('/records/sum', { params: filter }).then( data => { this.startBalance = data.data.sum })
      await axios.get(`/records/statistic/sum?period_step=${this.periodStep}`).then(({ data }) => balancesData = data.statistic)

      datasets = prepareBalanceDatasets(balancesData, this.startBalance)
      this.balancesChart = initBalanceChart(document.getElementById('balance-chart'), datasets, this.periodStep)
    }
  }
}
</script>