<template>
  <section id="content">
    <b-container class="mt-5">
      <b-row class="py-3">
        <b-col md="7">
          <FilterChips />
        </b-col>
        <b-col md="1">
          <SortByDropdown
            :options="orderOptions"
            :selectedOption="orderOption"
            @selectOption="opt => { this.orderOption = opt; this.fetch() }" />
        </b-col>
        <b-col md="4">
        </b-col>
      </b-row>
      <b-row>
        <b-col md="8">
					<b-row class="cards-deck" @scroll="recordsScroll">
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
  import SortByDropdown from '../components/SortByDropdown.vue'
  import axios from 'axios'
  import debounce from 'lodash.debounce'
  import { mapState } from 'vuex'

  export default {
    components: { RecordFilter, FilterChips, SortByDropdown },

    data: function() {
      return {
        replenishments: [],
        orderOption: null,
        total: 0,
        isFetching: false
      }
    },

    watch: {
      filter: {
        handler: function(){
          this.debouncedFetch()
        },
        deep: true
      }
    },

    created() {
      this.orderOptions = [
        { "order[field]": "records_sum", "order[type]": "asc" },
        { "order[field]": "records_sum", "order[type]": "desc" },
        { "order[field]": "name", "order[type]": "asc" },
        { "order[field]": "name", "order[type]": "desc" }
      ];
      this.orderOption = this.orderOptions[1];
    },

    mounted() {
      this.fetch();
      this.debouncedFetch = debounce(this.fetch, 500);
    },

    computed: {
      ...mapState(['filter']),

      replenishmentsCount() {
        return this.replenishments.length
      },

      sourceParams() {
        return Object.assign({
          'fields': 'records_sum',
          'order[field]': 'records_sum',
          'record[name]': this.filter.name,
          'record[card]': this.filter.card,
          'record[tags]': this.filter.tags,
          'record[performed_at][gt]': this.filter.from,
          'record[performed_at][lt]': this.filter.to,
          'record[amount][gt]': 0,
          'order[type]': 'desc',
          'limit': 30
        }, this.orderOption)
      }
    },

    methods: {
      fetch(params = {}) {
        this.isFetching = true;
        axios.get('/records/names', { params: Object.assign({}, this.sourceParams, params) })
          .then(resp => {
            if(params.offset) this.replenishments = [...[], ...this.replenishments, ...resp.data.record_names]
            else this.replenishments = resp.data.record_names
            this.total = resp.data.total_count
          })
          .then(() => this.isFetching = false)
      },

      recordsScroll(e) {
        e.preventDefault();
        const elem = e.target;

        if((elem.scrollTop + 1000) > elem.scrollHeight && !this.isFetching && this.replenishmentsCount < this.total) {
          this.fetch({offset: this.replenishmentsCount, limit: 30});
        }
      }
    }
  }
</script>
<style>
</style>
