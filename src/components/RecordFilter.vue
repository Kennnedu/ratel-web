<template>
  <b-form>
    <b-form-group
      label-cols-sm="3"
      label="Type:"
    >
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

    <b-form-group id="filter-name-group" label="Name:" label-for="filter-name" label-cols-sm="3">
      <b-form-input
        type="text"
        id="filter-name"
        :value="filter.name"
        @input="val => updateFilter({changes: { name: val }})"></b-form-input>
    </b-form-group>

    <b-form-group id="filter-source-group" label="Source:" label-for="filter-card" label-cols-sm="3">
      <b-form-input
        type="text"
        id="filter-card"
        :value="filter.card"
        @input="val => updateFilter({changes: { card: val }})"></b-form-input>
    </b-form-group>

    <b-form-group id="filter-tags-group" label="Tags:" label-for="filter-tags" label-cols-sm="3">
      <b-form-input
        type="text"
        id="filter-tags"
        :value="filter.tags"
        @input="val => updateFilter({changes: { tags: val }})"></b-form-input>
    </b-form-group>

    <b-form-group id="filter-performed-group" label="Period:" label-for="filter-performed" label-cols-sm="3">
      <b-form-select
        id="filter-performed"
        v-model="selectedPerformedHandler"
        :options="performedHandlerOptions()"
      ></b-form-select>
    </b-form-group> 
    <b-form-group id="filter-range" label="Range" v-if="selectedPerformedHandler === 'custom'">
      <flat-pickr :value="[...[], ...[filter.from, filter.to]]"
                  class="form-control"
                  :config="{mode: 'range', onChange: updateDateRange}"></flat-pickr>
    </b-form-group>
    <b-button class="float-left" @click="resetFilter">Reset</b-button>
    <b-button class="float-right" :disabled="isEqlFilterToDefFilter" @click="saveDefaultFilter">Save as Default</b-button>
  </b-form>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getDefaultFilter, getDefaultPerformedHandler, getPerformedHandlerOptions, performedHandlerObject } from '../utils/filter'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment'

export default {
  components: { flatPickr },

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
