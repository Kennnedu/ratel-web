<template>
  <b-card no-body>
    <b-card-header>
      <h4>Accounts</h4>
    </b-card-header>
    <b-card-body>
      <canvas id="accounts-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
    </b-card-body>
  </b-card>
</template>
<script>
import axios from 'axios'
import { mapGetters, mapState } from 'vuex'
import { prepareCardsData } from '../utils/chartsData'
import { initCardsChart } from '../utils/charts'

export default {
  mounted() {
    this.fetchAccountsData();
  },

  computed: {
    ...mapState(['totalSum']),
    ...mapGetters(['cardsCount', 'filterRecordParams']),
  },

  watch: {
    filterRecordParams: {
      handler: function(){
        if(this.accountsChart) this.accountsChart.destroy();
        this.fetchAccountsData()
      },
      deep: true
    },
  },

  methods: {
    fetchAccountsData() {
      axios.get('/cards', {
        params: Object.assign({ 'fields': 'records_sum', 'limit': this.cardsCount }, this.filterRecordParams)
      }).then(({data}) => {
        this.accountsChart = initCardsChart(document.getElementById('accounts-chart'), prepareCardsData(data.cards, this.totalSum))
      })
    }
  }
}
</script>