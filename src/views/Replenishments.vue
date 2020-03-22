<template>
  <section id="content">
    <b-container class="mt-5">
      <b-row class="py-3">
        <b-col md="8">
          <FilterChips />
        </b-col>
        <b-col md="4">
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
          <b-row class="cards-deck">
            <b-col v-for="replenishmentItem in replenishments" :key="replenishmentItem.name" md="4" class="py-3">
              <b-card no-body :class="{ positive: replenishmentItem.records_sum > 0 }">
                <b-card-body>
                  <b-card-sub-title class="mb-2">{{replenishmentItem.name}}</b-card-sub-title>
                  <b-card-title>{{replenishmentItem.records_sum}}</b-card-title>
                </b-card-body>
              </b-card>
            </b-col>
          </b-row>
        </b-col>
        <b-col md="4">
          <b-card no-body>
            <b-tabs card>
              <b-tab title="Filter" class="side-tab" active>
                <RecordFilter/>
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script>
  import RecordFilter from '../components/RecordFilter.vue'
  import FilterChips from '../components/FilterChips.vue'
  import axios from 'axios'
  import debounce from 'lodash.debounce'
  import { mapState } from 'vuex'

  export default {
    components: { RecordFilter, FilterChips },

    data: function() {
      return {
        replenishments: []
      }
    },

    watch: {
      filter: {
        handler: function(){
          this.debouncedReplenishments()
        },
        deep: true
      }
    },

    mounted() {
      this.fetchReplenishments();
      this.debouncedReplenishments = debounce(this.fetchReplenishments, 500);
    },

    computed: {
      ...mapState(['filter']),

      sourceParams() {
        return {
          'fields': 'records_sum',
          'order[field]': 'records_sum',
          'record[name]': this.filter.name,
          'record[card]': this.filter.card,
          'record[tags]': this.filter.tags,
          'record[performed_at][gt]': this.filter.from,
          'record[performed_at][lt]': this.filter.to,
          'record[amount][gt]': 0,
          'order[type]': 'desc',
          'limit': 150
        }
      }
    },

    methods: {
      fetchReplenishments() {
        axios.get('/records/names', { params: this.sourceParams })
            .then(resp => this.replenishments = resp.data.record_names)
      }
    }
  }
</script>
<style>
</style>
