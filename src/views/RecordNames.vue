<template>
  <section id="content">
    <b-container>
      <b-row class="py-2" v-if="isMobile()">
        <b-col cols="6">
          <b-button v-b-toggle.sidebar-1 size="sm" block>Filter</b-button>
        </b-col>
        <b-col cols="6">
          <SortByDropdown
            :options="orderOptions"
            :selectedOption="orderOption"
            :block="true"
            @selectOption="opt => { this.orderOption = opt; this.fetch() }" />
        </b-col>
        <b-col cols="12" class="pb-1">
          <FilterChips />
        </b-col>
      </b-row>
      <b-row class="py-2" v-else>
        <b-col md="9" cols="12" class="pb-1 pt-1">
          <FilterChips />
        </b-col>
        <b-col md="3" offset-md="0" cols="auto" offset="4" class="pb-1 pt-1">
          <b-button-toolbar aria-label="Toolbar with button groups and dropdown menu" class="float-right">
            <b-button-group size="sm" >
              <b-button v-b-toggle.sidebar-1 size="sm">Filter</b-button>
              <SortByDropdown
                :options="orderOptions"
                :selectedOption="orderOption"
                @selectOption="opt => { this.orderOption = opt; this.fetch() }" />
            </b-button-group>
          </b-button-toolbar>
        </b-col>
      </b-row>
      <b-row class="work-space">
        <b-col md="12">
          <b-overlay :show="isFetching">
            <b-row class="work-space__deck" @scroll="recordsScroll" :aria-hidden="isFetching ? 'true' : null">
              <b-col v-for="expenceItem in expences" :key="expenceItem.name" md="3" class="py-3">
                <b-card no-body :class="`work-space__card shadow-sm ${ expenceItem.records_sum > 0 ? 'work-space__card_positive' : '' }`">
                  <b-card-body>
                    <b-card-sub-title class="mb-2">{{expenceItem.name}}</b-card-sub-title>
                    <b-card-title>{{expenceItem.records_sum}}</b-card-title>
                  </b-card-body>
                </b-card>
              </b-col>
            </b-row>
          </b-overlay>
        </b-col>
      </b-row>
    </b-container>
    <b-sidebar id="sidebar-1" title="Filter" right shadow backdrop>
      <b-container>
        <RecordFilter/>
      </b-container>
    </b-sidebar>
  </section>
</template>
<script>
  import RecordFilter from '../components/RecordFilter.vue'
  import FilterChips from '../components/FilterChips.vue'
  import SortByDropdown from '../components/SortByDropdown.vue'
  import axios from 'axios'
  import debounce from 'lodash.debounce'
  import { mapState } from 'vuex'
  import { isMobile } from './../utils/mobileDetect.js'

  export default {
    components: { RecordFilter, FilterChips, SortByDropdown },

    data: function() {
      return {
        expences: [],
        orderOption: null,
        isFetching: true,
        total: 0
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

      expencesCount() {
        return this.expences.length
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
          'record[amount][gt]': this.filter.type  === 'Replenish' ? 0 : null,
          'record[amount][lt]': this.filter.type === 'Expences' ?  0 : null,
          'order[type]': 'asc',
					'limit': 30
        }, this.orderOption)
      }
    },

    methods: {
      fetch(params = {}) {
        this.isFetching= true
        axios.get('/records/names', { params: Object.assign({}, this.sourceParams, params)})
          .then(resp => {
            if(params.offset) this.expences = [...[], ...this.expences, ...resp.data.record_names]
            else this.expences = resp.data.record_names
            this.total = resp.data.total_count
          })
          .then(() => this.isFetching = false)
      },

      recordsScroll(e) {
        e.preventDefault();
        const elem = e.target;

        if((elem.scrollTop + 1000) > elem.scrollHeight && !this.isFetching && this.expencesCount < this.total) {
          this.fetch({offset: this.expencesCount, limit: 30});
        }
      },

      isMobile() {
        return isMobile();
      }
    }
  }
</script>
<style>
</style>
