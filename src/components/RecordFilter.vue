<template>
  <b-form>
    <b-form-group label="Record Type" label-size="sm">
      <b-form-radio-group
        class="pt-2"
        :options="['Expences', 'Replenish', 'Both']"
        buttons
        button-variant="outline-secondary"
        size="sm"
        :checked="filter.type"
        @input="val => updateFilter({changes: { type: val }})"
      ></b-form-radio-group>
    </b-form-group>

    <FilterNames />

    <FilterAccounts />

    <FilterTags />

    <b-form-group id="filter-performed-group" label="Period" label-size="sm">
      <b-input-group>
        <b-input-group-prepend>
          <b-input-group-text ><font-awesome-icon icon="calendar-alt"/></b-input-group-text>
        </b-input-group-prepend>
        <b-form-select
          id="filter-performed"
          v-model="selectedPerformedHandler"
          :options="performedHandlerOptions()"
        ></b-form-select>
      </b-input-group>
    </b-form-group> 
    <b-form-group id="filter-range" label="Range" v-if="selectedPerformedHandler === 'custom'" label-size="sm">
      <flat-pickr :value="[...[], ...[filter.from, filter.to]]"
                  class="form-control"
                  :config="{mode: 'range', onChange: updateDateRange}"></flat-pickr>
    </b-form-group>
    <b-button class="float-left" @click="resetFilter" size="sm">Reset</b-button>
    <b-button class="float-right" :disabled="isEqlFilterToDefFilter" @click="saveDefaultFilter" size="sm">Save as Default</b-button>
  </b-form>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getDefaultFilter, getDefaultPerformedHandler, getPerformedHandlerOptions, performedHandlerObject } from '../utils/filter'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment'
import FilterAccounts from './FilterAccounts.vue'
import FilterNames from './FilterNames.vue'
import FilterTags from './FilterTags.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faCalendarAlt)

export default {
  components: { flatPickr, FilterTags, FilterAccounts, FilterNames },

  data: function() {
    return {
      selectedPerformedHandler: getDefaultPerformedHandler(),
      defaultFilter: getDefaultFilter()
    }
  },

  computed: {
    ...mapState(['filter']),

    isEqlFilterToDefFilter() {
      const defFilter = this.defaultFilter;
      const filter= this.filter;

      return filter.name === defFilter.name && filter.card === defFilter.card &&
        filter.from === defFilter.from && filter.to === defFilter.to && filter.tags === defFilter.tags &&
        filter.type === defFilter.type
    }
  },

  methods: {
    ...mapMutations(['updateFilter']),

    saveDefaultFilter() {
      this.defaultFilter = this.filter
      localStorage.setItem('performedHandler', this.selectedPerformedHandler)
      localStorage.setItem('defaultFilter', JSON.stringify(this.defaultFilter))
    },

    resetFilter() {
      this.selectedPerformedHandler = getDefaultPerformedHandler();
      this.updateFilter({changes: this.defaultFilter});
    },

    performedHandlerOptions() {
      return getPerformedHandlerOptions()
    },

    updateDateRange(dateRange) {
      dateRange = dateRange.map(el => moment(el).format('YYYY-MM-DD'))

      if(dateRange.length === 2 && (this.filter.from !== dateRange[0]
        && this.filter.to !== dateRange[1])) {
        this.updateFilter({changes: { from: dateRange[0], to: dateRange[1] }})
      }
    }
  },

  watch: {
    selectedPerformedHandler: function(val) {
      if(val !== 'custom') this.updateFilter({ changes: performedHandlerObject()[val] })
    }
  }
}
</script>
<style>
</style>
