<template>
  <b-card no-body>
    <b-card-header>
      <h4>Cards</h4>
    </b-card-header>
    <b-card-body>
      <canvas id="cards-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
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
    this.fetchCardData();
  },

  computed: {
    ...mapState(['totalSum']),
    ...mapGetters(['cardsCount']),
  },

  methods: {
    fetchCardData() {
      axios.get(`/cards?fields=records_sum&limit=${this.cardsCount}`).then(({data}) => {
        initCardsChart(document.getElementById('cards-chart'), prepareCardsData(data.cards, this.totalSum))
      })
    }
  }
}
</script>