<template>
  <b-container>
    <b-row>
      <b-col cols="12" md="6" class="mt-3">
        <b-card no-body>
          <b-card-header class="d-flex justify-content-between">
            <h4>Expences</h4>
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
      <b-col cols="12" md="6" class="mt-3">
        <b-card no-body>
          <b-card-header class="d-flex justify-content-between">
            <h4>Income</h4>
            <b-form-group>
              <b-form-radio-group
                :options="['day', 'week', 'month', 'quarter', 'year']"
                buttons
                button-variant="outline-secondary"
                size="sm"
                :checked="replenishPeriod"
                @input="val => this.replenishPeriod = val"
              >
              </b-form-radio-group>
            </b-form-group>
          </b-card-header>
          <b-card-body>
            <canvas id="replenishment-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12" md="6" class="mt-3">
        <b-card no-body>
          <b-card-header>
            <h4>Tags</h4>
          </b-card-header>
          <b-card-body>
            <canvas id="tags-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col cols="12" md="6" class="mt-3">
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
import Chart from 'chart.js';
import axios from 'axios';
import { mapGetters, mapState } from 'vuex'

export default {
  data: function() {
    return {
      expencesPeriod: 'month',
      replenishPeriod: 'month',
    }
  },

  watch: {
    expencesPeriod() {
      if(this.expencesChart) this.expencesChart.destroy();
      return this.fetchExpencesData();
    },

    replenishPeriod() {
      if(this.replenishChart) this.replenishChart.destroy();
      return this.fetchReplenishmentData();
    }
  },

  mounted() {
    Chart.defaults.global.defaultFontFamily = "'Nunito', sans-serif"
    Chart.defaults.global.defaultFontSize = 11

    this.fetchExpencesData();
    this.fetchReplenishmentData();
    this.fetchTagData();
    this.fetchCardData();
  },

  computed: {
    ...mapState(['totalSum']),
    ...mapGetters(['tagsCount', 'cardsCount']),
  },

  methods: {
    fetchExpencesData() {
      axios.get(`/records/statistic/sum?type=expences&period_step=${this.expencesPeriod}`).then(({ data }) => {
        this.expencesChart = new Chart(document.getElementById('expences-chart'), {
          type: 'bar',
          data: {
            labels: data.statistic.map(el => el['performed_date']),
            datasets: [{
              label: 'Expences',
              data: data.statistic.map(el => el['sum_amount'] * -1),
              borderColor: "#dc3545",
              backgroundColor: "#dc3545",
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              xAxes: [{
                scaleLabel: {
                  // display: 'auto',
                },
                type: 'time',
                time: {
                  unit: this.expencesPeriod
                }
              }],
              yAxes: [{
                scaleLabel: {
                  // display: 'auto',
                },
              }]
            }
          }
        })
      })
    },

    fetchReplenishmentData() {
      axios.get(`/records/statistic/sum?type=replenish&period_step=${this.replenishPeriod}`).then(({ data }) => { 
        this.replenishChart = new Chart(document.getElementById('replenishment-chart'), {
          type: 'bar',
          data: {
            labels: data.statistic.map(el => el['performed_date']),
            datasets: [{
              label: 'Income',
              data: data.statistic.map(el => el['sum_amount']),
              borderColor: "#28a745",
              backgroundColor: "#28a745",
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              xAxes: [{
                type: 'time',
                time: {
                  tooltipFormat:'MM/DD/YYYY',
                  unit: this.replenishPeriod
                }
              }]
            }
          }
        })
      })
    },

    fetchTagData() {
      axios.get(`/tags?fields=records_sum&limit=${this.tagsCount}`).then(({data}) => {
        let labels = data.tags.map(el => el['name'])
        let dataset = data.tags.map(el => el['records_sum'])
        let colors = data.tags.map(() => this.dynamicColors());

        const sum = dataset.reduce((calc, val) => Number((calc + Number(val)).toFixed(2)), 0)

        if(sum !== this.totalSum) {
          labels.push('Undefined')
          dataset.push(Number((this.totalSum - sum).toFixed(2)))
          colors.push('rgb(169, 169, 169)')
        }        

        new Chart(document.getElementById('tags-chart'), {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              data: dataset,
              backgroundColor: colors
            }]
          }
        })
      })
    },

    fetchCardData() {
      axios.get(`/cards?fields=records_sum&limit=${this.cardsCount}`).then(({data}) => {
        let labels = data.cards.map(el => el['name'])
        let dataset = data.cards.map(el => el['records_sum'])
        let colors = data.cards.map(() => this.dynamicColors());

        const sum = dataset.reduce((calc, val) => Number((calc + Number(val)).toFixed(2)), 0)

        if(sum !== this.totalSum) {
          labels.push('Undefined')
          dataset.push(Number((this.totalSum - sum).toFixed(2)))
          colors.push('rgb(169, 169, 169)')
        }

        new Chart(document.getElementById('cards-chart'), {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: dataset,
              backgroundColor: colors
            }]
          },
          options: {
            circumference: Math.PI,
            rotation: -Math.PI
          }
        })
      })
    },

    dynamicColors() {
      const colors = ["rgb(54, 162, 235)", "rgb(75, 192, 192)", "rgb(255, 159, 64)", "rgb(153, 102, 255)", "rgb(255, 99, 132)", "rgb(255, 205, 86)"]
      return colors[Math.floor( Math.random() * colors.length)]
    }
  }
}
</script>
<style lang="">
</style>