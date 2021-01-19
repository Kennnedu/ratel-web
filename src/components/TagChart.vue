<template>
  <b-card no-body>
    <b-card-header>
      <h4>Tags</h4>
    </b-card-header>
    <b-card-body>
      <canvas id="tags-chart" style="position: relative; height: 40vh; width: 80vh;"></canvas>
    </b-card-body>
  </b-card>
</template>
<script>
import axios from 'axios'
import { prepareTagsData } from '../utils/chartsData'
import { initTagsChart } from '../utils/charts'
import { mapGetters, mapState } from 'vuex'

export default {
  mounted() {
    this.fetchTagData();
  },

  computed: {
    ...mapState(['totalSum']),
    ...mapGetters(['tagsCount', 'filterRecordParams']),
  },

  watch: {
    filterRecordParams: {
      handler: function(){
        if(this.tagsChart) this.tagsChart.destroy();
        this.fetchTagData()
      },
      deep: true
    },
  },

  methods: {
    fetchTagData() {
      axios.get('/tags', {
        params: Object.assign({ 'fields': 'records_sum', 'limit': this.tagsCount }, this.filterRecordParams) 
      }).then(({data}) => {
        this.tagsChart = initTagsChart(document.getElementById('tags-chart'), prepareTagsData(data.tags, this.totalSum))
      })
    },
  }
}
</script>