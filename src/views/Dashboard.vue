<template>
  <b-container>
    <b-row>
      <template v-if="isMobile()">
        <b-col cols="12" class="mt-3">
          <b-button v-b-toggle.sidebar-1 block size="sm">Filter</b-button>
        </b-col>
        <b-col cols="12" class="mt-3">
          <filter-chips />
        </b-col>
      </template>
      <template v-else>
        <b-col cols="6" class="mt-3">
          <filter-chips />
        </b-col>
        <b-col cols="6" class="mt-3">
          <b-button v-b-toggle.sidebar-1 size="sm" class="float-right">Filter</b-button>
        </b-col>
      </template>
      <b-col cols="12" class="mt-3">
        <balance-chart />
      </b-col>
      <b-col cols="12" class="mt-3">
        <expences-income-chart />
      </b-col>
      <b-col cols="12" class="mt-3">
        <tag-chart />
      </b-col>
      <b-col cols="12" class="mt-3">
        <account-chart />
      </b-col>
    </b-row>
    <b-sidebar id="sidebar-1" title="Filter" right shadow>
      <b-container>
        <record-filter />
      </b-container>
    </b-sidebar>
  </b-container>
</template>
<script>
import ExpencesIncomeChart from '../components/ExpencesIncomeChart'
import AccountChart from '../components/AccountChart'
import TagChart from '../components/TagChart'
import BalanceChart from '../components/BalanceChart.vue'
import FilterChips from '../components/FilterChips.vue'
import RecordFilter from '../components/RecordFilter.vue'
import { isMobile } from './../utils/mobileDetect.js'

export default {
  components: { ExpencesIncomeChart, AccountChart, TagChart, BalanceChart, FilterChips, RecordFilter },

  methods: {
    isMobile() {
      return isMobile();
    }
  },
}
</script>