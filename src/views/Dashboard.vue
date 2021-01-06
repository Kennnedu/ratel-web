<template>
  <b-container>
    <b-row>
      <b-col cols="12" class="mt-3">
        <b-card no-body>
          <b-card-header class="d-flex justify-content-between flex-wrap">
            <h4>Expences/Income</h4>
            <b-form-group>
              <b-form-radio-group
                :options="['day', 'week', 'month', 'quarter', 'year']"
                buttons
                button-variant="outline-secondary"
                size="sm"
                :checked="expencesPeriod"
                @input="val => this.expencesPeriod = val"
              >
            </b-form-radio-group>
            </b-form-group>
          </b-card-header>
          <b-card-body>
            <canvas id="expences-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="12" class="mt-3">
        <b-card no-body>
          <b-card-header>
            <h4>Tags</h4>
          </b-card-header>
          <b-card-body>
            <canvas id="tags-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="12" class="mt-3">
        <b-card no-body>
          <b-card-header>
            <h4>Cards</h4>
          </b-card-header>
          <b-card-body>
            <canvas id="cards-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import axios from 'axios';
import { prepareExpencesIncomeDatasets, prepareTagsData, prepareCardsData } from '../utils/chartsData'
import { initExpencesIncomeChart, initTagsChart, initCardsChart } from '../utils/charts'
import { mapGetters, mapState } from 'vuex'

export default {
  data: function() {
    return {
      expencesPeriod: 'month'
    }
  },

  watch: {
    expencesPeriod() {
      if(this.expencesChart) this.expencesChart.destroy();
      return this.fetchExpencesData();
    }
  },

  mounted() {
    this.fetchExpencesData();
    this.fetchTagData();
    this.fetchCardData();
  },

  computed: {
    ...mapState(['totalSum']),
    ...mapGetters(['tagsCount', 'cardsCount']),
  },

  methods: {
    async fetchExpencesData() {
      let expencesData = [], incomeData = [], datasets = [];

      await axios.get(`/records/statistic/sum?type=expences&period_step=${this.expencesPeriod}`).then(({ data }) => expencesData = data.statistic)
      await axios.get(`/records/statistic/sum?type=replenish&period_step=${this.expencesPeriod}`).then(({ data }) => incomeData = data.statistic)

      datasets = prepareExpencesIncomeDatasets(incomeData, expencesData)

      this.expencesChart = initExpencesIncomeChart(document.getElementById('expences-chart'), datasets[0], datasets[1], this.expencesPeriod)
    },

    fetchTagData() {
      axios.get(`/tags?fields=records_sum&limit=${this.tagsCount}`).then(({data}) => {
        initTagsChart(document.getElementById('tags-chart'), prepareTagsData(data.tags, this.totalSum))
      })
    },

    fetchCardData() {
      axios.get(`/cards?fields=records_sum&limit=${this.cardsCount}`).then(({data}) => {
        initCardsChart(document.getElementById('cards-chart'), prepareCardsData(data.cards, this.totalSum))
      })
    }
  }
}
</script>
<style lang="">
</style>